require('dotenv').config()
const express = require('express')
const AppError = require('./src/utils/AppError')

const app = express()

app.use(express.json())

const authRouter = require('./src/routes/auth')
const peliculasRouter = require('./src/routes/peliculas')

app.use('/api/auth', authRouter)
app.use('/api/peliculas', peliculasRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }

  console.error('ERROR:', err)
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Ruta no encontrada'
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})