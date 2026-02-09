const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
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

  let grid = '<ul id="inv-display">';
  vehicles.forEach((vehicle) => {
    const image = vehicle.inv_image && vehicle.inv_image.length
      ? vehicle.inv_image
      : "/images/vehicles/no-image.png";

    const thumbnail = vehicle.inv_thumbnail && vehicle.inv_thumbnail.length
      ? vehicle.inv_thumbnail
      : "/images/vehicles/no-image-tn.png";

    grid += "<li>";
    grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
               <img src="${image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
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

/* ************************
 * Build classification list for dropdowns (sticky)
 ************************** */
Util.buildClassificationList = async function (selectedId = null) {
  let data = [];
  try {
    data = await invModel.getClassifications();
  } catch (err) {
    console.error("buildClassificationList DB error:", err);
  }

  if (!Array.isArray(data) || data.length === 0) {
    return '<select id="classificationList" name="classification_id"><option value="">No classifications available</option></select>';
  }

  let selectHTML = '<select name="classification_id" id="classificationList" required>';
  selectHTML += '<option value="">Choose a Classification</option>';

  data.forEach((row) => {
    selectHTML += `<option value="${row.classification_id}"`;
    if (selectedId && row.classification_id == selectedId) {
      selectHTML += " selected";
    }
    selectHTML += `>${row.classification_name}</option>`;
  });

  selectHTML += "</select>";
  return selectHTML;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  res.locals.accountData = null
  res.locals.loggedin = 0

  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (!err) {
        res.locals.accountData = accountData
        res.locals.loggedin = 1
      }
      next()
    })
  } else {
    next()
  }
}


/* ****************************************
 * Check if client is logged in (basic authorization)
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("error", "Please log in.") // changed to "error" so template shows
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
