const express = require('express')
const app = express()
const {listAppointments, createAppointment, listMyAppointments} = require("./handlers")

app.use(express.json())

/**
 * @typedef Appointment
 * @property {uuid} id
 * @property {boolean} available
 * @property {string} vet
 * @property {string} date
 */

/**
 * List appointments.
 *
 * Request: GET /api/appointments
 * Response:
 *    200 {appointments: Appointment[]}
 */
app.get('/api/appointments', listAppointments)

/**
 * List all appointments booked by the current client.
 *
 * Request: GET /api/my/appointments
 * Response:
 *    200 {appointments: Appointment[]}
 */
app.get('/api/my/appointments', listMyAppointments)

/**
 * Create an appointment.
 *
 * Request:  POST /api/appointments
 * Body:     {date: '2019-01-01T10:00:00.000Z'}
 * Response:
 *    200 {appointments: Appointment[]}
 */
app.post('/api/appointments', createAppointment)


module.exports = app
