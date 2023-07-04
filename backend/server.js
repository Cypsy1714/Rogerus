require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// require routes
const userRoutes = require('./routes/users')

// express app
const app = express();

// middleware
app.use(express.json()) // parse json data

// routes
app.use('/api/users', userRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to the database.')

    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('Listening for requests on port: ', process.env.PORT)
    })

  })
  .catch((err) => {
    console.log(err)
  }) 