# DBL Works React Native code challenge

In this task you are required to build out a simple Expo/React Native application, enabling a user
to find and book an appointment.

You have been provided with a simplistic Expo set up utilising NativeBase UI elements.

A basic API stub is available via `yarn api`. This provides two endpoints at `localhost:3005`;

## API service (http://localhost:3005)

### `GET /api/appointment`

No params required. Will return a list of available appointments:

```json
{
  "appointments": [
    {
      "date": "2022-05-26T10:00:00Z",
      "vet": "Dr. Smith"
    }
  ]
}
```

### `POST /api/appointment`

Posting the `date` back to `/api/appointment` will return a `200` confirmation;

```json
{
  "message": "Appointment booked",
  "date": "2022-05-26T10:00:00Z"
}
```

This API has a 30% chance of returning a `400` error to simulate a failed booking. We would like to see
some sensible error handling for these occasions.
