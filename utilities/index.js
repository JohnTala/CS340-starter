
const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.forEach((row) => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
        ${row.classification_name}
      </a>
    </li>`;
  });
  list += "</ul>";
  return list;
};

/* ************************
 * Build the classification view HTML
 ************************** */
Util.buildClassificationGrid = async function(data) {
  let grid = "";

  if (data.length > 0) {
    grid = '<ul id="inv-display">';

    data.forEach(vehicle => {
      grid += '<li>';

      // Ensure thumbnail path works correctly
      const thumbnailPath = vehicle.inv_thumbnail.startsWith("/assets/")
        ? vehicle.inv_thumbnail
        : `/assets/${vehicle.inv_thumbnail.replace(/^\/+/, "")}`;

      // Vehicle link and image
      grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                 <img src="${thumbnailPath}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
               </a>`;

      // Name and Price
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += `<h2>
                 <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                   ${vehicle.inv_make} ${vehicle.inv_model}
                 </a>
               </h2>`;
      grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
      grid += '</div>';

      grid += '</li>';
    });

    grid += '</ul>';
  } else {
    // No vehicles found
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
};


/* ************************
 * Build single vehicle HTML (optional, if you want to preformat detail page)
 ************************** */
Util.buildVehicleDetail = function(vehicle) {
  if (!vehicle) return '<p class="notice">Vehicle not found.</p>';

  const imagePath = vehicle.inv_image.startsWith("/")
    ? vehicle.inv_image
    : "/" + vehicle.inv_image;

  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${imagePath}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="vehicle-info">
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
        <p><strong>Miles:</strong> ${vehicle.inv_miles.toLocaleString()}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
      </div>
    </div>
  `;
};

module.exports = Util;
