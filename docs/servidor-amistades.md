# Amistades, invitaciones y solicitudes de unión: esquema para PocketBase

La app (v00.01.84) usa 5 colecciones nuevas. Todas son de tipo "base". Los ids son los que genera la app (15 caracteres a-z0-9) o los de PocketBase; no hace falta nada especial.
Las reglas usan la sintaxis de PocketBase. `@request.auth.id` es el usuario conectado.

## 1. `codigos` (código de amigo público de cada usuario)
| Campo | Tipo | Notas |
|---|---|---|
| uid | text, requerido | id del usuario. **Índice único** |
| code | text, requerido | 8 caracteres (A-Z sin I/L/O/0/1 y 2-9). **Índice único** |
| name | text | nombre visible |

Reglas
- List/Search y View: `@request.auth.id != ""`
- Create: `@request.auth.id != "" && @request.body.uid = @request.auth.id`
- Update: `uid = @request.auth.id`
- Delete: vacío (solo superusuario)

## 2. `presencia` (señal de actividad; solo la ven los amigos)
| Campo | Tipo | Notas |
|---|---|---|
| uid | text, requerido | **Índice único** |
| ping | number | marca de tiempo en ms |

Reglas
- List/Search y View:
  `@request.auth.id != "" && (uid = @request.auth.id || @request.auth.role >= 2 || (@collection.amistades.status = "ok" && ((@collection.amistades.a = @request.auth.id && @collection.amistades.b = uid) || (@collection.amistades.b = @request.auth.id && @collection.amistades.a = uid))))`
- Create: `@request.auth.id != "" && @request.body.uid = @request.auth.id`
- Update: `uid = @request.auth.id`
- Delete: vacío

(Cada usuario escribe aquí cada 60 s. El panel de administración sigue leyendo `users.ping`, que se mantiene.)

## 3. `amistades`
| Campo | Tipo | Notas |
|---|---|---|
| a | text, requerido | quien envía la solicitud |
| b | text, requerido | quien la recibe |
| an | text | nombre de a |
| bn | text | nombre de b |
| status | select: `pending`, `ok` | |
| creado | number | ms |

Reglas
- List/Search y View: `a = @request.auth.id || b = @request.auth.id`
- Create: `@request.auth.id != "" && @request.body.a = @request.auth.id && @request.body.status = "pending"`
- Update (solo el receptor acepta): `b = @request.auth.id && @request.body.status = "ok" && @request.body.a:isset = false && @request.body.b:isset = false`
- Delete: `a = @request.auth.id || b = @request.auth.id` (rechazar, cancelar y eliminar amigo)

## 4. `invitaciones` (el GM invita a un amigo a su partida)
| Campo | Tipo |
|---|---|
| pid | text, requerido (id de la partida) |
| pname | text |
| gm | text, requerido (id del GM) |
| gmn | text (nombre del GM) |
| dest | text, requerido (id del invitado) |
| status | select: `pending`, `ok`, `no` |
| creado | number |

Reglas
- List/Search y View: `gm = @request.auth.id || dest = @request.auth.id`
- Create: `@request.auth.id != "" && @request.body.gm = @request.auth.id`
- Update: `gm = @request.auth.id || dest = @request.auth.id`
- Delete: `gm = @request.auth.id || dest = @request.auth.id`

## 5. `solicitudes` (un jugador pide unirse a la partida de un amigo)
| Campo | Tipo |
|---|---|
| pid | text, requerido |
| pname | text |
| gm | text, requerido (id del GM de la partida) |
| uid | text, requerido (quien pide unirse) |
| name | text |
| status | select: `pending`, `ok`, `no` |
| creado | number |

Reglas
- List/Search y View: `uid = @request.auth.id || gm = @request.auth.id`
- Create: `@request.auth.id != "" && @request.body.uid = @request.auth.id && @request.body.status = "pending"`
- Update (solo el GM responde): `gm = @request.auth.id`
- Delete: `uid = @request.auth.id || gm = @request.auth.id`

## Reglas de colecciones que ya existen y que esta función necesita
- `partidas`: cualquier usuario conectado debe poder **listar y ver** partidas (la búsqueda por código ya lo requiere), incluida la consulta `gm = "<id de un amigo>"`.
- `miembros`: cualquier usuario conectado debe poder **listar** por `pid` (se usa para saber si la sala está llena). La app ya lo hace en la búsqueda por código.
- `salidas`: sin cambios.

## Cómo funciona (resumen)
1. Cada usuario tiene un código de amigo (`codigos`). Otra persona lo escribe y se crea una `amistades` en estado `pending`; el receptor la acepta (`ok`) o la borra.
2. Solo los amigos aceptados leen `presencia` del otro (y los usuarios con rol 2 o más).
3. El GM invita a un amigo (`invitaciones`). El invitado acepta (la app abre la unión a la partida y borra la invitación) o la rechaza (la borra).
4. En «Buscar partida → Mis amigos», la app lista las partidas abiertas de tus amigos con las plazas. Si no está llena, se crea una `solicitudes`. El GM la acepta (`ok`) o rechaza (`no`); si la acepta, el jugador completa la unión desde su lado (la app crea su `miembros`).
5. El código de la partida sigue entrando directo, sin aceptación.
