// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log('Middleware error handling')
  const errorStatus = err.statusCode || 500
  const errorMessage = err.message || 'Произошла какая-то ошибка'
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage
  })
}

module.exports = errorHandler
