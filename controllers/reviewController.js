const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 *  Build add review view
 * ************************** */
reviewCont.buildAddReview = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const vehicleData = await invModel.getInventoryByInvId(inv_id)
  const vehicleName = `${vehicleData.inv_make} ${vehicleData.inv_model}`
  
  res.render("./reviews/add-review", {
    title: `Review ${vehicleName}`,
    nav,
    errors: null,
    inv_id,
    vehicleName,
    review_rating: "",
    review_title: "",
    review_text: ""
  })
}

/* ***************************
 *  Process add review
 * ************************** */
reviewCont.addReview = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_id, review_rating, review_title, review_text } = req.body
  const account_id = res.locals.accountData.account_id

  const addResult = await reviewModel.addReview(
    inv_id,
    account_id,
    review_rating,
    review_title,
    review_text
  )

  if (addResult) {
    req.flash("notice", "Review submitted successfully! It will appear after approval.")
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Sorry, adding the review failed.")
    const vehicleData = await invModel.getInventoryByInvId(inv_id)
    const vehicleName = `${vehicleData.inv_make} ${vehicleData.inv_model}`
    res.status(501).render("reviews/add-review", {
      title: `Review ${vehicleName}`,
      nav,
      errors: null,
      inv_id,
      vehicleName,
      review_rating,
      review_title,
      review_text
    })
  }
}

/* ***************************
 *  Build review management view (Admin only)
 * ************************** */
reviewCont.buildReviewManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const reviews = await reviewModel.getAllReviews()
  
  res.render("./reviews/management", {
    title: "Review Management",
    nav,
    reviews,
    errors: null
  })
}

/* ***************************
 *  Approve review (Admin only)
 * ************************** */
reviewCont.approveReview = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  
  const approveResult = await reviewModel.approveReview(review_id)
  
  if (approveResult) {
    req.flash("notice", "Review approved successfully.")
  } else {
    req.flash("notice", "Sorry, approving the review failed.")
  }
  
  res.redirect("/reviews/management")
}

/* ***************************
 *  Delete review (Admin only)
 * ************************** */
reviewCont.deleteReview = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  
  const deleteResult = await reviewModel.deleteReview(review_id)
  
  if (deleteResult) {
    req.flash("notice", "Review deleted successfully.")
  } else {
    req.flash("notice", "Sorry, deleting the review failed.")
  }
  
  res.redirect("/reviews/management")
}

module.exports = reviewCont