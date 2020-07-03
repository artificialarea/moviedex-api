require('dotenv').config()
console.log(process.env.API_TOKEN)
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./movies-data-small.json')

const app = express();

// Install Middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

// VALIDATION MIDDLEWARE
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json('Unauthorized request')
  }

  next()
})

app.get('/movie', (req, res) => {
  let response = MOVIEDEX
  const { genre, country, avg_vote } = req.query

  console.log(avg_vote, parseFloat(avg_vote), +avg_vote)

  // Validation
  if(avg_vote && isNaN(+avg_vote)) { // unary plus: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unary_plus
    return res
      .status(400)
      .json("avg_vote must be numeric")
  }
  
  // if valid 
  if(avg_vote) {
    response = response.filter(movie => {
     return movie.avg_vote >= parseFloat(avg_vote)
    })
  }

  if(genre) {
    response = response.filter(movie => {
      return movie.genre.toLowerCase().includes(genre.toLowerCase())
    })
  }

  if(country) {
    response = response.filter(movie => {
      return movie.country.toLowerCase().includes(country.toLowerCase())
    })
  }

  res.json(response)
})


// server
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost${PORT}`)
})
