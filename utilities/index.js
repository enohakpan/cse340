const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  try {
    let data = await invModel.getClassifications()
    console.log('✅ Navigation data retrieved:', data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    
    // Check if data and rows exist before processing
    if (data && data.rows && data.rows.length > 0) {
      data.rows.forEach((row) => {
        list += "<li>"
        list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" title="See our inventory of ' +
          row.classification_name +
          ' vehicles">' +
          row.classification_name +
          "</a>"
        list += "</li>"
      })
    } else {
      console.warn('⚠️ No classification data available for navigation')
      list += '<li><span class="nav-disabled">Categories (Database unavailable)</span></li>'
    }
    
    list += "</ul>"
    return list
  } catch (error) {
    console.error('❌ Error building navigation:', error.message)
    // Return basic navigation when database is unavailable
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    list += '<li><span class="nav-disabled">Categories (Database unavailable)</span></li>'
    list += "</ul>"
    return list
  }
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data && data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = async function(vehicle){
  let detailHTML
  if(vehicle){
    // Format price with currency symbol and commas
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(vehicle.inv_price)
    
    // Format mileage with commas
    const formattedMiles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
    
    detailHTML = `
      <div class="vehicle-detail">
        <div class="vehicle-image">
          <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </div>
        <div class="vehicle-info">
          <h2 class="vehicle-title">${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <div class="vehicle-specs">
            <div class="spec-item">
              <strong>Year:</strong> ${vehicle.inv_year}
            </div>
            <div class="spec-item">
              <strong>Price:</strong> ${formattedPrice}
            </div>
            <div class="spec-item">
              <strong>Mileage:</strong> ${formattedMiles} miles
            </div>
            <div class="spec-item">
              <strong>Color:</strong> ${vehicle.inv_color}
            </div>
            <div class="spec-item">
              <strong>Classification:</strong> ${vehicle.classification_name}
            </div>
          </div>
          <div class="vehicle-description">
            <h3>Vehicle Description</h3>
            <p>${vehicle.inv_description}</p>
          </div>
        </div>
      </div>
    `
  } else {
    detailHTML = '<p class="notice">Sorry, the requested vehicle could not be found.</p>'
  }
  return detailHTML
}

module.exports = Util