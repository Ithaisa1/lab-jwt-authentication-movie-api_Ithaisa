require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Error handling middleware
const AppError = require('./utils/AppError')

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

// Routers
const peliculasRouter = require('./routes/peliculas')
const authRouter = require('./routes/auth')

app.use('/api/peliculas', peliculasRouter)
app.use('/api/auth', authRouter)

// Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})