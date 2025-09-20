/* ***************************
 * Error Handling Middleware
 * ************************** */

/**
 * Global error handling middleware
 * Catches all errors and renders appropriate error pages
 */
const errorHandler = {
  /**
   * Handle 404 errors - Page not found
   */
  handleNotFound: (req, res, next) => {
    const error = new Error('Page not found')
    error.status = 404
    next(error)
  },

  /**
   * Handle all errors - Main error handler
   */
  handleErrors: async (err, req, res, next) => {
    let status = err.status || 500
    let message = err.message || 'Internal Server Error'
    let nav = ''

    // Log the error for debugging
    console.error('❌ Error occurred:', {
      status: status,
      message: message,
      stack: err.stack,
      url: req.url,
      method: req.method
    })

    try {
      // Try to get navigation for error pages
      const utilities = require('../utilities/')
      nav = await utilities.getNav()
    } catch (navError) {
      console.error('❌ Error getting navigation for error page:', navError.message)
      nav = '<ul><li><a href="/" title="Home page">Home</a></li></ul>'
    }

    // Set appropriate error messages and status codes
    if (status === 404) {
      message = 'Sorry, the page you requested could not be found.'
    } else if (status === 500) {
      message = 'Sorry, there was a server error. Please try again later.'
    }

    // Render the error page
    res.status(status).render('errors/error', {
      title: `${status} Error`,
      nav: nav,
      status: status,
      message: message,
      error: process.env.NODE_ENV === 'development' ? err : {}
    })
  }
}

module.exports = errorHandler
