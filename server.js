require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const dbSetting = process.env.NODE_ENV === 'production' ? './movies-data.json' : './movies-data-small.json';
const MOVIEDEX = require(dbSetting);

const app = express();

// Install Middleware
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

// VALIDATION MIDDLEWARE
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json('Unauthorized request');
  }

  next();
});

app.get('/movie', (req, res) => {
  let response = MOVIEDEX;
  const { genre, country, avg_vote } = req.query;
  
  // Validation
  if(avg_vote && isNaN(+avg_vote)) { // unary plus: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unary_plus
    return res
    .status(400)
    .json('avg_vote must be numeric');
  }
  
  // if valid 
  if(avg_vote) {
    response = response.filter(movie => {
      return movie.avg_vote >= parseFloat(avg_vote);
    });
  }

  if(genre) {
    response = response.filter(movie => {
      return movie.genre.toLowerCase().includes(genre.toLowerCase());
    });
  }

  if(country) {
    response = response.filter(movie => {
      return movie.country.toLowerCase().includes(country.toLowerCase());
    });
  }

  res.json(response);
});

// 4 parameters in middleware, express knows to treat this as error handler
app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }};
  } else {
    response = { error };
  }
  res.status(500).json(response);
});


// server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('server started up');
});
 