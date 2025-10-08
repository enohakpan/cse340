// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const validate = require("../utilities/review-validation")

// Route to build add review view
router.get("/add/:inv_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildAddReview))

// Route to process add review
router.post("/add", 
  utilities.checkLogin,
  validate.reviewRules(),
  validate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

// Route to build review management view (Admin only)
router.get("/management", utilities.checkAccountType, utilities.handleErrors(reviewController.buildReviewManagement))

// Route to approve review (Admin only)
router.post("/approve/:review_id", utilities.checkAccountType, utilities.handleErrors(reviewController.approveReview))

// Route to delete review (Admin only)
router.post("/delete/:review_id", utilities.checkAccountType, utilities.handleErrors(reviewController.deleteReview))

module.exports = router;