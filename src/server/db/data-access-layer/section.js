const { query } = require('../index');
const { getUserByKey } = require('./user');
/**
 * Add students to db
 * @param {string[]} studentKeys
 * @return {void}
 */
const addStudents = async studentKeys => {
  Promise.all(
    studentKeys.map(async studentKey => {
      query('INSERT INTO logic_user (key, admin) VALUES ($1, false);', [
        studentKey
      ]);
    })
  );
};

/**
 * Add students to a section
 * @param {object} sectionData
 * @param {string[]} studentKeys    Array of student keys
 */
const addStudentsToSection = async (sectionData, studentKeys) => {
  const sectionId = await getSectionIdFromSectionNumber(sectionData);
  console.log('HERE', sectionId);
  Promise.all(
    studentKeys.map(async studentKey => {
      const studentId = await getUserIdFromKey(studentKey);
      console.log('new student ID', studentId);
      addStudentToSection(sectionId, studentId);
    })
  );
};

/**
 * Add students to a section by section ID
 * @param {string} sectionId
 * @param {string[]} studentKeys    Array of student keys
 */
const addStudentsToSectionById = async (sectionId, studentKeys) => {
  console.log('addStudentsToSectionById', sectionId);
  Promise.all(
    studentKeys.map(async studentKey => {
      const studentId = await getUserIdFromKey(studentKey);
      addStudentToSection(sectionId, studentId);
    })
  );
};

/**
 * Checks if a section with the given data exists.
 * @param  {integer}  sectionNumber
 * @param  {string}  term
 * @param  {integer}  year
 * @return {Promise}
 */
const checkIfSectionExists = async ({ sectionNumber, term, year }) => {
  const q = await query(
    `SELECT id FROM section
    WHERE section_number = $1
    AND term = $2
    AND year = $3`,
    [sectionNumber, term, year]
  );
  return q.rows.length > 0;
};

/**
 * Get the section data for an instructor
 * @param  {string}  instructorId
 * @return {object[]} Array of section data led by instructor
 */
const getInstructorSections = async instructorId => {
  try {
    console.log('getInstructorSections', instructorId);
    const q = await query(
      `SELECT * FROM section
      INNER JOIN instructor_v_section
      ON instructor_v_section.section_id = section.id
      WHERE instructor_id = $1`,
      [instructorId]
    );
    console.log('Q!!!!', q);
    return q.rows;
  } catch (e) {
    console.log(e);
  }
};

const getDueDate = async (problemsetId, sectionId) => {
  console.log('getDueDate', problemsetId, sectionId);
  try {
    const response = await query(
      `SELECT due_date from due_date
      WHERE problemset_id = $1 AND section_id = $2`,
      [problemsetId, sectionId]
    );
    console.log('response', response);
    return response.rows[0].due_date;
  } catch (e) {
    console.log(e);
  }
};

const getUserSection = async userId => {
  try {
    console.log('getUserSection', userId);
    const q = await query(
      `SELECT section_id FROM student_roster
      WHERE student_id = $1`,
      [userId]
    );
    console.log('Q!!!!', q);
    return q.rows[0].section_id;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Get the section ID for a section, given the section number.
 * @param  {string}  sectionNumber
 * @return {string} The section ID.
 */
const getSectionIdFromSectionNumber = async ({ sectionNumber, term, year }) => {
  console.log('getSectionIdFromSectionNumber', sectionNumber, term, year);
  try {
    const q = await query(
      `SELECT id FROM section
      WHERE section_number = $1 AND term = $2 AND year = $3`,
      [sectionNumber, term, year]
    );
    console.log('q!!!!', q);
    const sectionId = q.rows[0].id;
    return sectionId;
  } catch (e) {}
};

/**
 * Get student ID from key
 * @param  {string}  key
 * @return {string} ID
 */
const getUserIdFromKey = async key => {
  console.log('getUserIdFromKey', key);
  try {
    const q = await query(
      `SELECT id FROM logic_user
      WHERE key = $1`,
      [key]
    );
    const id = q.rows[0].id;
    return id;
  } catch (e) {}
};

const getStudentsInSection = async sectionId => {
  console.log('getStudentsInSection HERE', sectionId, typeof sectionId);
  try {
    const q = await query(
      `SELECT id, key FROM logic_user
      INNER JOIN student_roster
      ON logic_user.id = student_roster.student_id
      WHERE logic_user.admin = false
      AND student_roster.section_id = $1`,
      [sectionId]
    );
    console.log('q', q);
    return q.rows;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Add individual student to section by ID's.
 * @param  {string}  sectionId
 * @param  {string}  studentId
 * @return {void}
 */
const addStudentToSection = async (sectionId, studentId) => {
  console.log('addStudentToSection', sectionId, studentId);
  const q = await query(
    `INSERT INTO student_roster (section_id, student_id)
    VALUES ($1, $2)`,
    [sectionId, studentId]
  );
  console.log(q);
};

/**
 * Create a new section in the database.
 * @param  {string} sectionId
 * @param  {string} instructorId
 * @return {void}
 */
const createNewSection = async ({ sectionNumber, term, year }) => {
  console.log('CREATE NEW SECTION');
  try {
    const q = await query(
      `INSERT INTO section (section_number, term, year)
      VALUES ($1, $2, $3) RETURNING id`,
      [sectionNumber, term, year]
    );
    const newSectionId = q.rows[0].id;
    return newSectionId;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Add instructor to section
 * @param  {string}  instructorId
 * @param  {string}  sectionId
 * @return {void}
 */
const addInstructorToSection = async (instructorId, sectionId) => {
  console.log('addInstructorToSection', instructorId, sectionId);
  await query(
    `INSERT INTO instructor_v_section (instructor_id, section_id)
    VALUES ($1, $2)`,
    [instructorId, sectionId]
  );
};

/**
 * Create a new section and associate it with an instructor.
 * @param  {object} sectionData - { sectionNumber, term, year }
 * @param  {string}  instructorId
 * @return {void}
 */
const createNewSectionWithInstructor = async (sectionData, instructorId) => {
  console.log('createNewSectionWithInstructor', sectionData, instructorId);
  const newSectionId = await createNewSection(sectionData);
  await addInstructorToSection(instructorId, newSectionId);
};

const getUserGrades = async userId => {
  console.log('getUserGrades');
  const q = await query(
    `SELECT problemset_id, score FROM problemset_score
    WHERE student_id = $1`,
    [userId]
  );
  // console.log("QUERY", q);
  const grades = q.rows;
  console.log('grades', grades);
  return grades;
};

const getUserGradesByUserKey = async key => {
  console.log('getUserGradesByKey');
  const { id } = await getUserByKey(key);
  console.log('id', id);
  const q = await query(
    `SELECT problemset_id, score FROM problemset_score
    WHERE student_id = $1`,
    [id]
  );
  // console.log('QUERY', q);
  const grades = q.rows.reduce(
    (acc, row) => Object.assign(acc, { [row.problemset_id]: row.score }),
    {}
  );
  console.log('grades', grades);
  return grades;
};

/**
 * Get the grades for all students in a section.
 * @param  {string}  sectionId
 * @return {object}  Map from user ID's to their grades.
 */
const getSectionGrades = async sectionId => {
  const result = {};
  const users = await getStudentsInSection(sectionId);
  console.log('got users');
  const grades = users.map(async user => {
    const grades = await getUserGradesByUserKey(user.key);
    result[user.key] = grades;
  });
  await Promise.all(grades);
  return result;
};

const getSectionProblemsetIds = async sectionId => {
  const q = await query(
    `SELECT problemset_id AS id, section_problemset.order
    FROM section_problemset WHERE section_id = $1
    ORDER BY section_problemset.order`,
    [sectionId]
  );
  console.log('sectionProblemsetIds', q);
  return q.rows;
};

const getSectionProblemsets = async sectionId => {
  const q = await query(
    `SELECT * FROM section_problemset
    RIGHT JOIN problemset
    ON problemset.id = section_problemset.problemset_id
    LEFT JOIN due_date
    ON due_date.section_id = section_problemset.section_id
    WHERE section_problemset.section_id = $1`,
    [sectionId]
  );
  console.log('sectionProblemsetIds', q);
  return q.rows;
};

const removeUserFromSection = async (userId, sectionId) => {
  const q = await query(
    `DELETE FROM student_roster WHERE student_id = $1 AND section_id = $2`,
    [userId, sectionId]
  );
  console.log('DELETE user', q);
  return;
};

const upsertProblemsetDueDate = async (problemsetId, sectionId, dueDate) => {
  console.log('UPSERT', problemsetId, sectionId, dueDate);
  const q = await query(
    `
    INSERT INTO due_date (problemset_id, section_id, due_date)
    VALUES ($1, $2, $3)
    ON CONFLICT ON CONSTRAINT unique_section_id_problemset_id
    DO
    UPDATE SET due_date.due_date = $3
    WHERE due_date.problemset_id = $1
    AND due_date.section_id = $2
  `,
    [problemsetId, sectionId, dueDate]
  );
  console.log('HOLY SHIT', q);
  return q.rows;
};

module.exports = {
  addStudents,
  addStudentsToSection,
  addStudentsToSectionById,
  checkIfSectionExists,
  createNewSectionWithInstructor,
  getDueDate,
  getInstructorSections,
  getSectionGrades,
  getSectionProblemsetIds,
  getSectionProblemsets,
  getStudentsInSection,
  getUserSection,
  getUserGrades,
  removeUserFromSection,
  upsertProblemsetDueDate
};
