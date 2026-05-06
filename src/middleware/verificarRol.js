const AppError = require('../utils/AppError')

const verificarRol = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new AppError('No autenticado', 401))
    }

    if (!roles.includes(req.usuario.rol)) {
      return next(new AppError('Acceso denegado', 403))
    }

    next()
  }
}

module.exports = verificarRol