
const pool = require("../database/");

async function getClassifications() {
  const data = await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
  return data.rows;
}

async function getInventoryByClassificationId(classification_id) {
  const data = await pool.query(
    `SELECT DISTINCT ON (i.inv_image)
         i.*, c.classification_name
     FROM public.inventory AS i
     JOIN public.classification AS c
       ON i.classification_id = c.classification_id
     WHERE i.classification_id = $1
     ORDER BY i.inv_image, i.inv_id;`,
    [classification_id]
  );
  return data.rows;
}

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

async function addClassification(classification_name) {
  const sql = "INSERT INTO public.classification (classification_name) VALUES ($1)";
  return await pool.query(sql, [classification_name]);
}

async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  const sql = `INSERT INTO public.inventory 
               (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
  return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
};
