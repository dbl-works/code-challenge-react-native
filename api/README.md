# Mock API Service

You can assume that all authentication has already taken place, and that the user's ID is being
passed to the API in the session details. Any request to make an appointment will allocate the
appointment to your user, and any requests for "my" appointments will only shows those booked by your user.

Some endpoints may return errors - it is up to you to handle them properly.

## Quick start

```shell
yarn start
```

**Note:** Yarn PNP should already be set up, meaning no need to run `yarn install` first.

This provides three endpoints at `localhost:3005`.

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

## Simulator access

Don't forget that local simulators overwrite the `localhost` address. This express app simply binds
to port `3005`, meaning it can be accessed via any IP pointing to your machine. Bear this in mind if
encounter network errors.
