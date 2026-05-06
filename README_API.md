# API de Películas con Autenticación JWT

API REST para gestión de películas con autenticación JWT, bcrypt y control de roles (usuario/admin).

## 🚀 Stack Tecnológico

- **Node.js** + **Express**
- **PostgreSQL**
- **bcrypt** (hashing de contraseñas)
- **jsonwebtoken** (JWT tokens)
- **dotenv** (variables de entorno)

## 📋 Requisitos Previos

- Node.js instalado
- PostgreSQL instalado y corriendo
- Base de datos `peliculas_db` creada

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd lab-jwt-authentication-movie-api_Ithaisa
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=peliculas_db
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h
PORT=3000
```

4. **Ejecutar script de base de datos**
```bash
psql -U postgres -d peliculas_db -f database.sql
```

5. **Iniciar servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Endpoints de la API

### 🔐 Autenticación

#### POST /api/auth/registro
Registra un nuevo usuario y devuelve un JWT.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": "usuario"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "usuario",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/auth/login
Inicia sesión y devuelve un JWT.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "usuario"
  }
}
```

#### GET /api/auth/perfil
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "usuario",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### 🎬 Películas

#### GET /api/peliculas (PÚBLICO)
Lista todas las películas.

**Response (200):**
```json
[
  {
    "id": 1,
    "titulo": "Inception",
    "anio": 2010,
    "genero": "Sci-Fi",
    "director": "Christopher Nolan",
    "sinopsis": "Un ladrón que roba secretos corporativos...",
    "poster_url": "https://example.com/poster.jpg",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/peliculas/:id (PÚBLICO)
Obtiene una película por ID.

**Response (200):**
```json
{
  "id": 1,
  "titulo": "Inception",
  "anio": 2010,
  "genero": "Sci-Fi",
  "director": "Christopher Nolan",
  "sinopsis": "Un ladrón que roba secretos corporativos...",
  "poster_url": "https://example.com/poster.jpg",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### POST /api/peliculas (REQUIERE AUTENTICACIÓN)
Crea una nueva película.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "titulo": "The Matrix",
  "anio": 1999,
  "genero": "Sci-Fi",
  "director": "Wachowski Sisters",
  "sinopsis": "Un programador descubre que el mundo es una simulación...",
  "poster_url": "https://example.com/matrix.jpg"
}
```

**Response (201):**
```json
{
  "id": 2,
  "titulo": "The Matrix",
  "anio": 1999,
  "genero": "Sci-Fi",
  "director": "Wachowski Sisters",
  "sinopsis": "Un programador descubre que el mundo es una simulación...",
  "poster_url": "https://example.com/matrix.jpg",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### PUT /api/peliculas/:id (SOLO ADMIN)
Actualiza una película existente.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "titulo": "The Matrix Reloaded",
  "anio": 2003
}
```

**Response (200):**
```json
{
  "id": 2,
  "titulo": "The Matrix Reloaded",
  "anio": 2003,
  "genero": "Sci-Fi",
  "director": "Wachowski Sisters",
  "sinopsis": "Un programador descubre que el mundo es una simulación...",
  "poster_url": "https://example.com/matrix.jpg",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### DELETE /api/peliculas/:id (SOLO ADMIN)
Elimina una película.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "mensaje": "Película eliminada correctamente"
}
```

#### POST /api/peliculas/:id/resenas (REQUIERE AUTENTICACIÓN)
Crea una reseña para una película.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "calificacion": 5,
  "comentario": "Excelente película, muy recomendada"
}
```

**Response (201):**
```json
{
  "id": 1,
  "pelicula_id": 1,
  "usuario_id": 1,
  "calificacion": 5,
  "comentario": "Excelente película, muy recomendada",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Control de Roles

- **usuario**: Puede crear películas y reseñas
- **admin**: Puede crear películas, reseñas, actualizar y eliminar películas

## 🧪 Ejemplos de Uso con cURL

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Admin","email":"admin@example.com","password":"admin123","rol":"admin"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Obtener películas (público)
```bash
curl http://localhost:3000/api/peliculas
```

### Crear película (con token)
```bash
curl -X POST http://localhost:3000/api/peliculas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{"titulo":"Interstellar","anio":2014,"genero":"Sci-Fi","director":"Christopher Nolan"}'
```

## 📁 Estructura del Proyecto

```
lab-jwt-authentication-movie-api_Ithaisa/
├── src/
│   ├── config/
│   │   └── db.js                 # Configuración de PostgreSQL
│   ├── controllers/
│   │   ├── authController.js     # Lógica de autenticación
│   │   └── peliculasController.js # Lógica de películas
│   ├── middleware/
│   │   ├── verificarToken.js    # Middleware JWT
│   │   └── verificarRol.js      # Middleware de roles
│   ├── routes/
│   │   ├── auth.js              # Rutas de autenticación
│   │   └── peliculas.js         # Rutas de películas
│   └── utils/
│       └── AppError.js          # Clase de errores personalizada
├── database.sql                 # Script de base de datos
├── index.js                     # Punto de entrada
├── package.json
└── .env.example                 # Plantilla de variables de entorno
```

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (10 salt rounds)
- Tokens JWT con expiración configurable
- Validación de roles en rutas protegidas
- Headers Bearer para autenticación
- Nunca se devuelve password_hash en las respuestas

## 🛠️ Scripts Disponibles

```bash
npm run dev    # Inicia con nodemon (desarrollo)
npm start      # Inicia con node (producción)
```

## 📝 Notas

- El token JWT debe incluirse en el header `Authorization: Bearer <token>`
- La calificación de reseñas debe estar entre 1 y 5
- Los campos obligatorios están validados en cada endpoint
- Errores manejados con middleware centralizado
