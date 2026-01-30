const pool=require("../database")

/*Register new account*/

async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}
module.exports={registerAccount}

// const pool = require("../database")

// /* Register a new account */
// async function registerAccount(firstname, lastname, email, hashedPassword) {
//   try {
//     const sql = `
//       INSERT INTO account 
//       (account_firstname, account_lastname, account_email, account_password, account_type)
//       VALUES ($1, $2, $3, $4, 'Client')
//       RETURNING *
//     `
//     const result = await pool.query(sql, [firstname, lastname, email, hashedPassword])
//     return result.rows[0] // return the newly created user
//   } catch (error) {
//     console.error("Error in registerAccount:", error)
//     return null
//   }
// }

// /* Get user by email (for login) */
// async function getUserByEmail(email) {
//   try {
//     const sql = "SELECT * FROM account WHERE account_email = $1"
//     const result = await pool.query(sql, [email])
//     return result.rows[0] || null
//   } catch (error) {
//     console.error("Error in getUserByEmail:", error)
//     return null
//   }
// }

// module.exports = {
//   registerAccount,
//   getUserByEmail,
// }
