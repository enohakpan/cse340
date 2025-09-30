const utilities = require("../utilities/")
const baseController = {}

/**
 * Builds the home page view
 * Handles database connectivity issues gracefully
 */
baseController.buildHome = async function(req, res){
  try {
    const nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render("index", {title: "Home", nav})
  } catch (error) {
    console.error('❌ Error building home page:', error.message)
    // Render home page with basic navigation if database fails
    const fallbackNav = '<ul><li><a href="/" title="Home page">Home</a></li><li><span class="nav-disabled">Categories (Database unavailable)</span></li></ul>'
    res.render("index", {title: "Home", nav: fallbackNav})
  }
}

module.exports = baseController