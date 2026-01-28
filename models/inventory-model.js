
const pool = require("../database/");

/* ***************************
 * Get all classifications
 *************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
    return data.rows;
  } catch (error) {
    console.error("getClassifications error:", error);
    return [];
  }
}

/* ***************************
 * Get inventory by classification
 * NO duplicate images
 *************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `
      SELECT DISTINCT ON (i.inv_image)
             i.inv_id,
             i.inv_make,
             i.inv_model,
             i.inv_year,
             i.inv_description,
             i.inv_image,
             i.inv_thumbnail,
             i.inv_price,
             i.inv_miles,
             i.inv_color,
             i.classification_id,
             c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
      ORDER BY i.inv_image, i.inv_id;
      `,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
    return [];
  }
}

/* ***************************
 * Get single vehicle by ID
 *************************** */
async function getInventoryById(inv_id) {
  try {
    const result = await pool.query(
      `
      SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
      `,
      [inv_id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("getInventoryById error:", error);
    return null;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
};
