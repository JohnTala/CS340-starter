const utilities = require("../utilities/");
const baseController = {};

/* ************************
 * Build Home Page
 ************************** */
baseController.buildHome = async (req, res) => {
  // Example home page data could be fetched here
  const nav = await utilities.getNav();
  // req.flash("notice","This is a flash message for Vehicles!")
  res.render("index", {
    title: "Welcome to CSE Motors",
    nav,
  });
};

module.exports = baseController;
