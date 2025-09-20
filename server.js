/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const db = require("./database/")


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/
app.use(static)
app.get("/", baseController.buildHome)
// Inventory routes
app.use("/inv", inventoryRoute)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 10000
const host = process.env.HOST || '0.0.0.0'

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, async () => {
  console.log(`🚀 App listening on ${host}:${port}`)
  
  // Test database connection on startup
  console.log('🔍 Testing database connection...')
  try {
    const dbConnected = await db.testConnection()
    if (dbConnected) {
      console.log('✅ Database connection verified successfully')
    } else {
      console.log('⚠️ Database connection failed - app will run with limited functionality')
    }
  } catch (error) {
    console.log('⚠️ Database connection test failed:', error.message)
    console.log('⚠️ App will run with limited functionality')
  }
})