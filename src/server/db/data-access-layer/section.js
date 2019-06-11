const { query } = require('../index');

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
 * @param {string} sectionData
 * @param {string[]} studentKeys    Array of student keys
 */
const addStudentsToSection = async (sectionData, studentKeys) => {
  const sectionId = await getSectionIdFromSectionNumber(sectionData);
  console.log('HERE', sectionId);
  Promise.all(
    studentKeys.map(async studentKey => {
      const studentId = await getUserIdFromKey(studentKey);
      addStudentToSection(sectionId, studentId);
    })
  );
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

module.exports = {
  addStudents,
  addStudentsToSection,
  createNewSectionWithInstructor
};
