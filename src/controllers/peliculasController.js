const pool = require('../config/db')
const AppError = require('../utils/AppError')

// LISTAR PELÍCULAS (PÚBLICO)
const listarPeliculas = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM peliculas ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// OBTENER PELÍCULA POR ID (PÚBLICO)
const obtenerPelicula = async (req, res, next) => {
  try {
    const { id } = req.params

    const { rows } = await pool.query(
      'SELECT * FROM peliculas WHERE id = $1',
      [id]
    )

    if (rows.length === 0) {
      throw new AppError('Película no encontrada', 404)
    }

    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}

// CREAR PELÍCULA (USUARIO AUTENTICADO)
const crearPelicula = async (req, res, next) => {
  try {
    const { titulo, anio, genero, director, sinopsis, poster_url } = req.body

    if (!titulo || !anio) {
      throw new AppError('titulo y anio son obligatorios', 400)
    }

    const { rows } = await pool.query(
      `INSERT INTO peliculas (titulo, anio, genero, director, sinopsis, poster_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [titulo, anio, genero, director, sinopsis, poster_url]
    )

    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
}

// ACTUALIZAR PELÍCULA (SOLO ADMIN)
const actualizarPelicula = async (req, res, next) => {
  try {
    const { id } = req.params
    const { titulo, anio, genero, director, sinopsis, poster_url } = req.body

    const { rows } = await pool.query(
      `UPDATE peliculas
       SET titulo = COALESCE($1, titulo),
           anio = COALESCE($2, anio),
           genero = COALESCE($3, genero),
           director = COALESCE($4, director),
           sinopsis = COALESCE($5, sinopsis),
           poster_url = COALESCE($6, poster_url)
       WHERE id = $7
       RETURNING *`,
      [titulo, anio, genero, director, sinopsis, poster_url, id]
    )

    if (rows.length === 0) {
      throw new AppError('Película no encontrada', 404)
    }

    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}

// ELIMINAR PELÍCULA (SOLO ADMIN)
const eliminarPelicula = async (req, res, next) => {
  try {
    const { id } = req.params

    const { rows } = await pool.query(
      'DELETE FROM peliculas WHERE id = $1 RETURNING *',
      [id]
    )

    if (rows.length === 0) {
      throw new AppError('Película no encontrada', 404)
    }

    res.json({ mensaje: 'Película eliminada correctamente' })
  } catch (err) {
    next(err)
  }
}

// LISTAR RESEÑAS DE UNA PELÍCULA (PÚBLICO)
const listarResenas = async (req, res, next) => {
  try {
    const { id } = req.params

    const { rows } = await pool.query(
      `SELECT r.*, u.nombre as usuario_nombre
       FROM resenas r
       JOIN usuarios u ON r.usuario_id = u.id
       WHERE r.pelicula_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    )

    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// CREAR RESEÑA (USUARIO AUTENTICADO)
const crearResena = async (req, res, next) => {
  try {
    const { id } = req.params
    const { calificacion, comentario } = req.body
    const usuario_id = req.usuario.id

    if (!calificacion || calificacion < 1 || calificacion > 5) {
      throw new AppError('La calificación debe estar entre 1 y 5', 400)
    }

    const { rows } = await pool.query(
      `INSERT INTO resenas (pelicula_id, usuario_id, calificacion, comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, usuario_id, calificacion, comentario]
    )

    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
  listarResenas,
  crearResena
}
