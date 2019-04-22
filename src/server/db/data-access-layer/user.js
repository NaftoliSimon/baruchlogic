const { query } = require('../index');

/**
 * Get user from user table by user.id
 * @param  {string} id - id of the desired user
 * @return {object|undefined} - the desired user, if found
 */
async function getUserById(id) {
  try {
    const user = await query('SELECT * FROM student WHERE id = $1', [id]);
    return user && user.rows && user.rows[0];
  } catch (e) {}
}

/**
 * Get user from user table by user.key
 * @param  {string} key - key of the desired user
 * @return {object|undefined} - the desired user, if found
 */
async function getUserByKey(key) {
  try {
    const user = await query('SELECT * FROM student WHERE key = $1', [key]);
    return user && user.rows && user.rows[0];
  } catch (e) {}
}

module.exports = {
  getUserById,
  getUserByKey
};
