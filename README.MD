# API for Boot.dev

## User resource

```json
{
  "id": "1",
  "email": "test@test.com",
  "updatedAt": "2026-04-01T14:39:15.145Z",
  "createdAt": "2026-04-01T14:39:15.145Z",
  "isChirpyRed": false
}
```

### POST /api/users

Creates a User and returns the created User without the password

#### Request Body:

```json
{
  "email": "",
  "password": ""
}
```

#### Response:

```json
{
  "createdAt": "2026-04-01T14:39:15.145Z",
  "email": "walt@breakingbad.com",
  "id": "0155ade2-4a2e-4efb-bfcd-a92d3f1713d1",
  "isChirpyRed": false,
  "updatedAt": "2026-04-01T14:39:15.145Z"
}
```

## Chirp resource

### GET /api/chirps[?userId]

Returns an array with either all chirps or when specified only the user's chirps

#### Response:

```json
[
  {
    "body": "I'm the one who knocks!",
    "createdAt": "2026-04-01T14:39:15.210Z",
    "id": "e21ffdef-fe8b-4ba4-a556-f4f0802c4ca7",
    "updatedAt": "2026-04-01T14:39:15.210Z",
    "userId": "0155ade2-4a2e-4efb-bfcd-a92d3f1713d1"
  },
  {
    "body": "Gale!",
    "createdAt": "2026-04-01T14:39:15.212Z",
    "id": "52e72efa-6989-4573-af02-94c7a6b80c4f",
    "updatedAt": "2026-04-01T14:39:15.212Z",
    "userId": "0155ade2-4a2e-4efb-bfcd-a92d3f1713d1"
  }
]
```

### GET /api/chirps/:chirpId

Get only specific chirp

### POST /api/chirps

Create a chirp

#### Request:

```http
POST http://localhost:8080/api/chirps
Content-Type: application/json
Authorization: Bearer TOKEN

{
  "body": "I'm the one who knocks!",
}
```

#### Response:

```json
{
  "body": "I'm the one who knocks!",
  "createdAt": "2026-04-01T14:39:15.210Z",
  "id": "e21ffdef-fe8b-4ba4-a556-f4f0802c4ca7",
  "updatedAt": "2026-04-01T14:39:15.210Z",
  "userId": "0155ade2-4a2e-4efb-bfcd-a92d3f1713d1"
}
```

## Admin resource

### POST /admin/reset

Deletes all users and chirps

### GET /admin/metrics

Shows metrics
