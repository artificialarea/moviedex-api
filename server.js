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

app.get('/', (req, res) => {
  res.send('Hello, Express.')
})




// server
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost${PORT}`)
})
