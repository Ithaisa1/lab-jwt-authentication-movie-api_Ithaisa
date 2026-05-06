## ¿Por qué el error es genérico?

Porque si dices “email no existe” o “contraseña incorrecta”, estás dando pistas a un atacante.
Así evitas que puedan adivinar usuarios válidos (ataques de enumeración).

## ¿Qué NO meter en el JWT?

- Contraseña
- password_hash
- datos sensibles (DNI, tarjeta, etc.)


## ¿Por qué bcrypt.compare?

Porque bcrypt:

-usa salt automáticamente
-el hash cambia cada vez


