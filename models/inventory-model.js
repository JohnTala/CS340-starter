const pool = require("../database/");

/* ===============================
 * Get all classifications
 * =============================== */
async function getClassifications() {
  const result = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
  return result.rows;
}

/* ===============================
 * Get all inventory by classification ID
 * =============================== */
async function getInventoryByClassificationId(classification_id) {
  const result = await pool.query(
    `SELECT i.*, c.classification_name
     FROM public.inventory AS i
     JOIN public.classification AS c
       ON i.classification_id = c.classification_id
     WHERE i.classification_id = $1
     ORDER BY i.inv_id;`, // Removed DISTINCT ON
    [classification_id]
  );
  return result.rows;
}

/* ===============================
 * Get single inventory item by ID
 * =============================== */
async function getInventoryById(inv_id) {
  const result = await pool.query(
    `SELECT i.*, c.classification_name
     FROM public.inventory AS i
     JOIN public.classification AS c
       ON i.classification_id = c.classification_id
     WHERE i.inv_id = $1`,
    [inv_id]
  );
  return result.rows[0] || null;
}

/* ===============================
 * Add a new classification
 * =============================== */
async function addClassification(classification_name) {
  const sql =
    "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
  const result = await pool.query(sql, [classification_name]);
  return result.rows[0];
}

/* ===============================
 * Add new inventory
 * =============================== */
async function addInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id,
  inv_status = "Available"
) {
  // Ensure fallback images if none provided
  if (!inv_image || inv_image.trim() === "") inv_image = "/images/vehicles/no-image.png";
  if (!inv_thumbnail || inv_thumbnail.trim() === "") inv_thumbnail = "/images/vehicles/no-image-tn.png";

  const sql = `INSERT INTO public.inventory 
               (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_status)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
               RETURNING *`;
  const result = await pool.query(sql, [
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    inv_status,
  ]);
  return result.rows[0];
}

/* ===============================
 * Update inventory
 * =============================== */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id,
  inv_status
) {
  // Ensure fallback images if none provided
  if (!inv_image || inv_image.trim() === "") inv_image = "/images/vehicles/no-image.png";
  if (!inv_thumbnail || inv_thumbnail.trim() === "") inv_thumbnail = "/images/vehicles/no-image-tn.png";

  const sql =
    `UPDATE public.inventory 
     SET inv_make=$1, inv_model=$2, inv_description=$3, inv_image=$4, inv_thumbnail=$5, inv_price=$6, inv_year=$7, inv_miles=$8, inv_color=$9, classification_id=$10, inv_status=$11
     WHERE inv_id=$12
     RETURNING *`;
  const result = await pool.query(sql, [
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_status,
    inv_id,
  ]);
  return result.rows[0];
}

/* ===============================
 * Delete inventory
 * =============================== */
async function deleteInventory(inv_id) {
  const sql = "DELETE FROM public.inventory WHERE inv_id=$1";
  const result = await pool.query(sql, [inv_id]);
  return result.rowCount;
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory,
};
