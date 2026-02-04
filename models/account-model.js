
const pool = require("../database")

/* **********************
 * Register new account
 * ********************* */
async function registerAccount(firstname, lastname, email, password) {
  try {
    const sql = `INSERT INTO account 
      (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client') RETURNING *`
    const result = await pool.query(sql, [firstname, lastname, email, password])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* **********************
 * Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 * Get user by email (for login)
 * ********************* */
async function getUserByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rows[0] || null
  } catch (error) {
    return null
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getUserByEmail, // <-- added this
}
