 ## ¿Por qué es importante que el mensaje de error del login sea genérico** ("Credenciales incorrectas") en lugar de especificar si fue el email o la contraseña lo que falló?

Porque si se especifica si el fallo es del email o de la contraseña, se está dando información útil a posibles atacantes.

Por ejemplo, si se indica que el email existe pero la contraseña es incorrecta, se facilita intentar accesos no autorizados mediante pruebas.

Por eso se usa un mensaje genérico como “credenciales incorrectas”, que no revela detalles internos.


## ¿Qué información NO deberías guardar nunca en el payload del JWT?** (pista: piensa en qué información es visible para cualquiera que tenga el token)

No se debe incluir información sensible o confidencial, ya que el JWT puede ser decodificado fácilmente.

Por ejemplo:

- contraseñas
- datos personales sensibles (DNI, dirección, etc.)
- información privada que no sea necesaria para la autenticación

En general, solo debe incluirse información mínima necesaria, como el id del usuario o su rol.

## ¿Por qué usamos `bcrypt.compare` en lugar de hashear la contraseña y compararla con `===`?

Porque las contraseñas no se almacenan en texto plano, sino en formato hash.

Un hash no se puede comparar directamente con una contraseña usando ===, ya que no son equivalentes.

bcrypt.compare se encarga de:

- aplicar el mismo proceso de hash a la contraseña introducida
- comparar de forma segura con el hash almacenado

Además, bcrypt incluye mecanismos como “salt” que aumentan la seguridad frente a ataques de fuerza bruta.