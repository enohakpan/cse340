const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data && data.length > 0 ? data[0].classification_name : "No Classification"
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    console.error("Error in buildByClassificationId:", error)
    next(error)
  }
}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryByInvId(inv_id)
    const detailHTML = await utilities.buildVehicleDetail(data)
    let nav = await utilities.getNav()
    
    if (data) {
      res.render("./inventory/detail", {
        title: data.inv_make + " " + data.inv_model,
        nav,
        detailHTML,
      })
    } else {
      // Vehicle not found - trigger 404 error
      const error = new Error("Vehicle not found")
      error.status = 404
      throw error
    }
  } catch (error) {
    console.error("Error in buildByInvId:", error)
    next(error)
  }
}

/* ***************************
 *  Trigger intentional error for testing
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  try {
    // Intentionally throw an error to test error handling
    throw new Error("Intentional server error for testing purposes")
  } catch (error) {
    console.error("Intentional error triggered:", error.message)
    next(error)
  }
}

module.exports = invCont