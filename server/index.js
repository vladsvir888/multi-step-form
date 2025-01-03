require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

const router = require('./router')
const errorHandler = require('./middlewares/error-handler')

const app = express()
const port = 5000

app.use(express.json())
app.use(cors())
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECT)

    app.listen(port, () => {
      console.log(`App listening on port ${port}`)
    })
  } catch (error) {
    console.log(error.message)
  }
}

start()
