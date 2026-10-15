# Plantillas de correo tematizadas (sin activar)

Paleta del inicio de sesión (rojo borgoña + dorado sobre fondo oscuro). Los correos no pueden cambiar de tema, así que usan siempre la versión oscura.

PocketBase > Ajustes > Plantillas de correo:
- `verificacion.html` -> "Verificación de correo". Asunto sugerido: `Verifica tu cuenta de {APP_NAME}`
- `restablecer-contrasena.html` -> "Restablecer contraseña". Asunto sugerido: `Restablece tu contraseña de {APP_NAME}`

Usan los marcadores de PocketBase `{ACTION_URL}` y `{APP_NAME}`. En Ajustes > Aplicación, pon el nombre `La Mesa Larga` y la URL de la app.
Para que el enlace del botón abra la app y no el panel de PocketBase, hay que fijar la "Action URL" de las plantillas a una página de la app (pendiente: la activamos cuando el servicio de envío esté listo).
