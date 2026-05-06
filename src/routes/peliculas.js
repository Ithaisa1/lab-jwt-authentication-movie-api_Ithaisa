const { Router } = require('express')
const router = Router()

const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')

const {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
  listarResenas,
  crearResena
} = require('../controllers/peliculasController')

// públicas
router.get('/', listarPeliculas)
router.get('/:id', obtenerPelicula)
router.get('/:id/resenas', listarResenas)

// protegidas
router.post('/', verificarToken, crearPelicula)
router.post('/:id/resenas', verificarToken, crearResena)

// solo admin
router.put('/:id', verificarToken, verificarRol('admin'), actualizarPelicula)
router.delete('/:id', verificarToken, verificarRol('admin'), eliminarPelicula)

module.exports = router