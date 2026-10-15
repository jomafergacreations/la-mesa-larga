# PocketBase: peticiones de baneo (app v00.01.94)

Los administradores (role = 2) ya no eliminan cuentas directamente: envían una petición y solo ALPHA (role = 3) decide.
Hace falta **una colección nueva** (créala igual que las de amistades: verificación obligatoria y role 3 siempre permitido).

## Colección `baneos` (tipo base)

| Campo | Tipo | Notas |
|---|---|---|
| uid | texto, requerido | id de quien solicita (administrador) |
| name | texto | nombre de quien solicita |
| tid | texto, requerido | id de la cuenta objetivo |
| tname | texto | nombre de la cuenta objetivo |
| reason | texto, máx. 600 | motivo |
| status | select: pending / ok / no | |
| creado | número | marca de tiempo (ms) |

Índices: `uid`, `tid`.

## Reglas (todas con `@request.auth.verified = true &&`)

- **List/View:** `uid = @request.auth.id || @request.auth.role = 3`
- **Create:** `@request.auth.role >= 2 && @request.body.uid = @request.auth.id && @request.body.status = "pending" && @request.body.tid != @request.auth.id`
- **Update:** `@request.auth.role = 3` (solo ALPHA acepta o rechaza)
- **Delete:** `uid = @request.auth.id || @request.auth.role = 3` (el solicitante puede quitar la respuesta ya leída)

## Recomendado: que el consentimiento lo exija el servidor

Ahora mismo la app impide eliminar a los administradores, pero un administrador técnico podría seguir
escribiendo `deleted = true` en `users` desde fuera de la app. Para cerrarlo, en la regla de **Update de `users`**
añade que solo el rol 3 pueda cambiar ese campo:

`(@request.body.deleted:isset = false || @request.body.deleted = deleted || @request.auth.role = 3)`

(combínala con `&&` con la regla que ya tienes).

## Qué hace la app

- Administrador: en Cuentas, el botón **Eliminar** se sustituye por **Solicitar baneo** (cuadro de motivo, mínimo 10 caracteres).
- ALPHA: nuevo apartado **Peticiones de baneo** (Soporte) con quién solicita, sobre quién y el motivo; botones Aceptar baneo (con confirmación, elimina la cuenta) y Rechazar. Aparece en la campana y en «Requiere tu atención».
- Al resolver, el administrador recibe un aviso y lo descarta con «Entendido» (borra su registro).
- Nueva consulta cada 10 s (solo administradores y ALPHA).
