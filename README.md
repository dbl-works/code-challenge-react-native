# DBL Works React Native code challenge

In this task you are required to build out a simple Expo/React Native application, enabling a user
to find and book an appointment.

You have been provided with a simplistic Expo set up utilising NativeBase UI elements.

A basic API stub is available in the `./api` directory. To run:

```shell
cd ./api && yarn && yarn setup && yarn start
```

This provides three endpoints at `localhost:3005`.

You can assume that all authentication has already taken place, and that the user's ID is being
passed to the API in the session details. Any request to make an appointment will allocate the
appointment to your user.

## API service (http://localhost:3005)

### [`GET /api/appointments`](http://localhost:3005/api/appointments)

No params required. Will return a list of available appointments:

```json
{
  "appointments": [
    {
      "id": "18052bea-3f8e-4bfe-9205-1c1d3ff2fb7b",
      "date": "2022-05-26T10:00:00Z",
      "vet": "Dr. Smith"
    }
  ]
}
```

### [`GET /api/my/appointments`](http://localhost:3005/api/my/appointments)

No params required. Will return a list of appointments booked by the current user:

```json
{
  "appointments": [
    {
      "id": "18052bea-3f8e-4bfe-9205-1c1d3ff2fb7b",
      "date": "2022-05-26T10:00:00Z",
      "vet": "Dr. Smith"
    }
  ]
}
```

### `POST /api/appointments`

Posting the `id` back to `/api/appointments` will return a `200` confirmation;

```json
{
  "message": "Appointment booked",
  "appointment": {
    "id": "18052bea-3f8e-4bfe-9205-1c1d3ff2fb7b",
    "date": "2022-05-26T10:00:00Z",
    "vet": "Dr. Smith"
  }
}
```

If the `id` is not found, unavailable or in the past, either a `400` or `409` response will be
issued with a human-readable `message` in the body.

We would like to see some sensible error handling for these occasions.
