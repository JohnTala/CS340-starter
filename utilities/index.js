const invModel = require("../models/inventory-model");

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 * Safe: catches DB errors and ensures an array
 ************************** */
Util.getNav = async function () {
  let data = [];
  try {
    data = await invModel.getClassifications();
  } catch (err) {
    console.error("getNav DB error:", err);
  }

  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((row) => {
      list += `<li>
        <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>`;
    });
  } else {
    console.log("No classifications found for nav.");
  }

  list += "</ul>";
  return list;
};

/* ************************
 * Build the classification view HTML grid
 ************************** */
Util.buildClassificationGrid = function (vehicles = []) {
  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  // Filter vehicles with images
  const filteredVehicles = vehicles.filter((v) => v.inv_image);

  if (filteredVehicles.length === 0) {
    return '<p class="notice">No vehicles with images available.</p>';
  }

  let grid = '<ul id="inv-display">';
  filteredVehicles.forEach((vehicle) => {
    grid += "<li>";
    grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
               <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
             </a>`;
    grid += '<div class="namePrice">';
    grid += "<hr />";
    grid += `<h2>
               <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                 ${vehicle.inv_make} ${vehicle.inv_model}
               </a>
             </h2>`;
    grid += `<span>$${vehicle.inv_price ? new Intl.NumberFormat("en-US").format(vehicle.inv_price) : "N/A"}</span>`;
    grid += "</div>";
    grid += "</li>";
  });
  grid += "</ul>";

  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
