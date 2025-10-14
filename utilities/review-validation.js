const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Review Data Validation Rules
  * ********************************* */
validate.reviewRules = () => {
  return [
    body("review_rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5 stars."),
    

    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Review text must be between 10 and 1000 characters."),
  ]
}

/* ******************************
 * Check review data and return errors or continue
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id, review_rating, review_text } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const invModel = require("../models/inventory-model")
    const vehicleData = await invModel.getInventoryByInvId(inv_id)
    const vehicleName = `${vehicleData.inv_make} ${vehicleData.inv_model}`
    res.render("reviews/add-review", {
      errors,
      title: `Review ${vehicleName}`,
      nav,
      inv_id,
      vehicleName,
      review_rating,
      review_text,
    })
    return
  }
  next()
}

module.exports = validate