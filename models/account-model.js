
const pool = require("../database")

/* **********************
 * Register new account
 * ********************* */
async function registerAccount(firstname, lastname, email, password) {
  const sql = `
    INSERT INTO account
      (account_firstname, account_lastname, account_email, account_password, account_type)
    VALUES ($1, $2, $3, $4, 'Client')
    RETURNING *
  `
  const result = await pool.query(sql, [firstname, lastname, email, password])
  return result.rows[0]
}

/* **********************
 * Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  const sql = "SELECT 1 FROM account WHERE account_email = $1"
  const result = await pool.query(sql, [account_email])
  return result.rowCount
}

/* **********************
 * Get user by email (for login)
 * ********************* */
async function getUserByEmail(account_email) {
  const sql = "SELECT * FROM account WHERE account_email = $1"
  const result = await pool.query(sql, [account_email])
  return result.rows[0] || null
}

/* *****************************
 * Return account data using email
 * ***************************** */
async function getAccountByEmail(account_email) {
  const sql = `
    SELECT
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      account_password
    FROM account
    WHERE account_email = $1
  `
  const result = await pool.query(sql, [account_email])
  return result.rows[0] || null
}

/* *****************************
 * Return account data using account_id
 * ***************************** */
async function getAccountById(account_id) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname, account_email, account_type
    FROM account
    WHERE account_id = $1
  `
  const result = await pool.query(sql, [account_id])
  return result.rows[0] || null
}

/* *****************************
 * Update account information
 * ***************************** */
async function updateAccountInfo(account_id, firstname, lastname, email) {
  const sql = `
    UPDATE account
    SET account_firstname = $1, account_lastname = $2, account_email = $3
    WHERE account_id = $4
    RETURNING *
  `
  const result = await pool.query(sql, [firstname, lastname, email, account_id])
  return result.rows[0] || null
}

/* *****************************
 * Update account password
 * ***************************** */
async function updateAccountPassword(account_id, hashedPassword) {
  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
    RETURNING *
  `
  const result = await pool.query(sql, [hashedPassword, account_id])
  return result.rows[0] || null
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getUserByEmail,
  getAccountByEmail,
  getAccountById,
  updateAccountInfo,
  updateAccountPassword
}
