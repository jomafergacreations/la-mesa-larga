# Cronómetro de partida · campos nuevos en PocketBase

Colección `partidas` (solo hay que añadir campos; las reglas no cambian: el GM ya puede actualizar su partida y los miembros ya pueden leerla).

| Campo   | Tipo   | Notas |
|---------|--------|-------|
| `tst`   | Text   | Estado: vacío, `run`, `pause`, `post` o `fin` |
| `tacc`  | Number | Milisegundos acumulados (sin decimales) |
| `tseg`  | Number | Marca de tiempo (ms) del último arranque; 0 si está detenido |
| `stats` | Text   | JSON con NPC fallecidos, caídas, revividos y daño por jugador. Máximo de longitud: déjalo en 0 (sin límite) o al menos 5000 |

Los campos `end` (Text) y `endAt` (Number) ya se usaban al finalizar; confirma que existen.
