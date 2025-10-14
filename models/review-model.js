const pool = require("../database/")

/* ***************************
 *  Create reviews table if it doesn't exist
 * ************************** */
async function createReviewsTable() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS public.reviews (
        review_id SERIAL PRIMARY KEY,
        inv_id INTEGER NOT NULL REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
        account_id INTEGER NOT NULL REFERENCES public.account(account_id) ON DELETE CASCADE,
        review_rating INTEGER NOT NULL CHECK (review_rating >= 1 AND review_rating <= 5),
        review_title VARCHAR(100) NOT NULL,
        review_text TEXT NOT NULL,
        review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        review_approved BOOLEAN DEFAULT false
      )
    `
    return await pool.query(sql)
  } catch (error) {
    console.error("Error creating reviews table: " + error)
  }
}

/* ***************************
 *  Get all approved reviews for a vehicle
 * ************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname 
      FROM public.reviews r
      JOIN public.account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1 AND r.review_approved = true
      ORDER BY r.review_date DESC
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByInvId error: " + error)
  }
}

/* ***************************
 *  Get average rating for a vehicle
 * ************************** */
async function getAverageRating(inv_id) {
  try {
    const sql = `
      SELECT AVG(review_rating)::NUMERIC(3,2) as avg_rating, COUNT(*) as review_count
      FROM public.reviews 
      WHERE inv_id = $1 AND review_approved = true
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("getAverageRating error: " + error)
  }
}

/* ***************************
 *  Add new review
 * ************************** */
async function addReview(inv_id, account_id, review_rating, review_text) {
  try {
    const sql = `
      INSERT INTO public.reviews (inv_id, account_id, review_text, review_rating)
      VALUES ($1, $2, $3, $4) RETURNING *
    `
    return await pool.query(sql, [inv_id, account_id, review_text, review_rating])
  } catch (error) {
    console.error("addReview error: " + error)
    return null
  }
}

/* ***************************
 *  Get all reviews for admin moderation
 * ************************** */
async function getAllReviews() {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname, i.inv_make, i.inv_model
      FROM public.reviews r
      JOIN public.account a ON r.account_id = a.account_id
      JOIN public.inventory i ON r.inv_id = i.inv_id
      ORDER BY r.review_date DESC
    `
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
    console.error("getAllReviews error: " + error)
  }
}

/* ***************************
 *  Approve review
 * ************************** */
async function approveReview(review_id) {
  try {
    const sql = "UPDATE public.reviews SET review_approved = true WHERE review_id = $1 RETURNING *"
    const data = await pool.query(sql, [review_id])
    return data.rows[0]
  } catch (error) {
    console.error("approveReview error: " + error)
  }
}

/* ***************************
 *  Delete review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM public.reviews WHERE review_id = $1"
    const data = await pool.query(sql, [review_id])
    return data
  } catch (error) {
    console.error("deleteReview error: " + error)
  }
}

module.exports = {
  createReviewsTable,
  getReviewsByInvId,
  getAverageRating,
  addReview,
  getAllReviews,
  approveReview,
  deleteReview
}