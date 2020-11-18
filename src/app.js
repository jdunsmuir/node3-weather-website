const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const hbs = require('hbs')
const {
  send
} = require('process')
const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const aboutDirectoryPath = path.join(__dirname, '../about')
const helpDirectoryPath = path.join(__dirname, '../help')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))
app.use(express.static(aboutDirectoryPath))
app.use(express.static(helpDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'John Dunsmuir'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'John Dunsmuir'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    helpText: 'A simple help message',
    name: 'John Dunsmuir'
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address'
    })
  }

  let address = req.query.address;
  geocode(address, (error, {
    latitude,
    longitude,
    location
  } = {}) => {
    if (error) {
      return res.send({
        error
      });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error
        });
      }
      res.send({
        location: location,
        forecast: forecastData
      })
    })
  })
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    })
  }

  console.log(req.query.search)
  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('error404', {
    title: 'Help 404',
    text: 'Help article not found',
    name: 'John Dunsmuir'
  })
})

app.get('*', (req, res) => {
  res.render('error404', {
    title: 'Error 404',
    text: 'My 404 page',
    name: 'John Dunsmuir'
  })
})

app.listen(3000, () => {
  console.log('Server is up on port 3000.')
})