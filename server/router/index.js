const express = require('express')
const InternetConnectionRequestModel = require('../models')

const router = express.Router()

router.post('/form', async (req, res, next) => {
  try {
    await InternetConnectionRequestModel.create(req.body)
    res.send({ success: true })
  } catch (error) {
    next(error)
  }
})

module.exports = router
