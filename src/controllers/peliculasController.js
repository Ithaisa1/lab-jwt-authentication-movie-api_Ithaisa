const pool = require('../config/db')
const AppError = require('../utils/AppError')

// GET /api/peliculas
const listarPeliculas = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM peliculas ORDER BY id')
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// GET /api/peliculas/:id
const obtenerPelicula = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM peliculas WHERE id = $1', [req.params.id])
    
    if (rows.length === 0) {
      throw new AppError('Película no encontrada', 404)
    }
    
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}

// POST /api/peliculas
const crearPelicula = async (req, res, next) => {
  try {
    const { titulo, anio, nota, director, genero } = req.body
    
    if (!titulo || !anio) {
      throw new AppError('titulo y anio son obligatorios', 400)
    }

    const { rows } = await pool.query(
      `INSERT INTO peliculas (titulo, anio, nota, director, genero)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titulo, anio, nota, director, genero]
    )
    
    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
}

// PUT /api/peliculas/:id
const actualizarPelicula = async (req, res, next) => {
  try {
    const { titulo, anio, nota, director, genero } = req.body
    
    const { rows } = await pool.query(
      `UPDATE peliculas
       SET titulo = COALESCE($1, titulo),
           anio = COALESCE($2, anio),
           nota = COALESCE($3, nota),
           director = COALESCE($4, director),
           genero = COALESCE($5, genero)
       WHERE id = $6
       RETURNING *`,
      [titulo, anio, nota, director, genero, req.params.id]
    )
    
    if (rows.length === 0) {
      throw new AppError('Película no encontrada', 404)
    }
    
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}

// DELETE /api/peliculas/:id
const eliminarPelicula = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM peliculas WHERE id = $1 RETURNING *',
      [req.params.id]
    )
    
    if (rows.length === 0) {
      throw new AppError('Película no encontrada', 404)
    }
    
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

// GET /api/peliculas/:id/resenas
const listarResenas = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM resenas WHERE pelicula_id = $1',
      [req.params.id]
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// POST /api/peliculas/:id/resenas
const crearResena = async (req, res, next) => {
  try {
    const { comentario, puntuacion } = req.body
    
    if (!comentario || !puntuacion) {
      throw new AppError('comentario y puntuacion son obligatorios', 400)
    }

    const { rows } = await pool.query(
      `INSERT INTO resenas (pelicula_id, usuario_id, comentario, puntuacion)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.params.id, req.usuario.id, comentario, puntuacion]
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
