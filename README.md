# Notes app

App móvil de notas con inicio de sesión mediante Google o GitHub. Cada usuario crea, edita, fija, busca y elimina sus propias notas, con tema claro/oscuro.

## Descripción

- Inicio de sesión con **Google** y **GitHub** (OAuth 2.0). No hay contraseñas.
- CRUD de notas privadas por usuario, con búsqueda y notas fijadas arriba.
- Tema claro/oscuro: sigue el del sistema y recuerda tu elección.
- Colores centralizados y fáciles de cambiar (`mobile/src/theme/colors.js`).

## Stack

| Capa | Tecnologías |
| --- | --- |
| App móvil | React Native (Expo), gluestack-ui (`@gluestack-ui/themed`), lucide-react-native, `@expo/vector-icons` |
| Sesión en la app | `expo-secure-store`, `expo-web-browser`, `expo-linking` |
| Backend | Node.js, Express |
| Base de datos | MongoDB + Mongoose |
| Autenticación | Passport (`passport-google-oauth20`, `passport-github2`) + JWT |


## Instalación

### Requisitos

- Node.js 18 o superior
- MongoDB en local o en Atlas
- Expo Go o un emulador (Android Studio / Xcode)
- Una app OAuth en Google y otra en GitHub

### 1. Credenciales OAuth

Registra estas URLs de callback (deben coincidir con `BASE_URL`):

| Proveedor | Dónde | Callback |
| --- | --- | --- |
| Google | Google Cloud Console → Credenciales → ID de cliente OAuth (Web) | `http://localhost:4000/auth/google/callback` |
| GitHub | Settings → Developer settings → OAuth Apps | `http://localhost:4000/auth/github/callback` |

> Google no acepta IPs privadas como redirect. En un teléfono físico expón el servidor con `ngrok http 4000` y usa esa URL en `BASE_URL`, en ambos proveedores y en `EXPO_PUBLIC_API_URL`.

### 2. Backend

```bash
cd server
cp .env.example .env    # completa las variables
npm install
npm run dev
```

Variables de `server/.env`:

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor (por defecto `4000`) |
| `MONGO_URI` | Cadena de conexión de MongoDB |
| `JWT_SECRET` | Secreto largo y aleatorio para firmar los tokens |
| `BASE_URL` | URL pública del servidor; se usa para construir los callbacks OAuth |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credenciales de Google |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Credenciales de GitHub |
| `ALLOWED_REDIRECTS` | Prefijos de deep link permitidos, separados por coma (`notesapp://,exp://`) |

### 3. App móvil

```bash
cd mobile
cp .env.example .env    # define EXPO_PUBLIC_API_URL
npx expo start
```

| Variable | Valor |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | `http://localhost:4000` (simulador iOS), `http://10.0.2.2:4000` (emulador Android) o la URL de ngrok (dispositivo físico) |

## API

URL base: `http://localhost:4000`. Los endpoints protegidos requieren la cabecera `Authorization: Bearer <token>`.

### Autenticación

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/auth/:provider?redirect=<deep link>` | Inicia el login. `:provider` es `google` o `github`. |
| `GET` | `/auth/:provider/callback` | Callback del proveedor. Redirige a `<redirect>?token=<jwt>` (o `?error=auth_failed`). |
| `GET` | `/auth/me/profile` | Devuelve el usuario autenticado.  |

Flujo:

1. La app abre `/auth/:provider` en el navegador del sistema.
2. El usuario autoriza en Google o GitHub.
3. El servidor crea o actualiza el usuario, firma un JWT (30 días) y redirige a `notesapp://auth?token=...`.
4. La app guarda el token en SecureStore y lo envía en cada petición.

Solo se aceptan `redirect` que empiecen por un prefijo de `ALLOWED_REDIRECTS`; si no, responde `400`.

### Notas

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/notes` | Lista tus notas, fijadas primero y luego por fecha de edición. Acepta `?q=texto` para buscar por palabras en título y contenido. |
| `POST` | `/notes` | Crea una nota. Responde `201` con la nota. |
| `PUT` | `/notes/:id` | Actualiza una nota. Acepta cualquier subconjunto de campos. |
| `DELETE` | `/notes/:id` | Elimina una nota. Responde `204`. |

Cuerpo de `POST` y `PUT`:

```json
{ "title": "Compras", "content": "Leche, pan", "pinned": false }
```

Nota devuelta:

```json
{
  "_id": "66f1c0...",
  "user": "66f1bf...",
  "title": "Compras",
  "content": "Leche, pan",
  "pinned": false,
  "createdAt": "2026-09-30T14:00:00.000Z",
  "updatedAt": "2026-09-30T14:00:00.000Z"
}
```