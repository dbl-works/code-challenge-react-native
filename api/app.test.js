const app = require('./app')
const {v4: uuid} = require('uuid')
const request = require('supertest')
const {DateTime} = require('luxon')
const {clientId} = require("./constants")

let db
beforeAll(() => {
  require('./setup_database')
  db = require('./db')
})

afterAll(() => {
  try {
    db.close()
  } catch {
    // ignore - db already closed
  }
})

describe('GET /api/appointments', () => {
  it('returns a list of appointments', async () => {
    await request(app).get('/api/appointments')
      .expect(200)
      .then((response) => {
        // Check type and length
        expect('appointments' in response.body).toBeTruthy()
        expect(response.body.appointments).toHaveLength(16)
      })
  })
})

describe('POST /api/appointments', () => {
  describe('when provided an invalid ID', () => {
    it('fails with an error message', async () => {
      await request(app)
        .post('/api/appointments', {id: uuid()})
        .expect(400, {message: 'Appointment not available'})
    })
  })

  describe('when provided a valid ID', () => {
    const appointments = {
      valid: {id: uuid(), date: DateTime.now().plus({hours: 1}).toISO(), vet: 'Dr. Smith', available: 1},
      past: {id: uuid(), date: DateTime.now().minus({hours: 1}).toISO(), vet: 'Dr. Deja Vu', available: 1},
      prebooked: {id: uuid(), date: DateTime.now().plus({hours: 1}).toISO(), vet: 'Dr. Busy', available: 0},
    }

    beforeAll(async () => {
      const resp = await new Promise((resolve) => {
        const stmt = db.prepare('INSERT INTO appointments (id, "date", vet, available) VALUES (?, ?, ?, ?)')
        for (const appointment of Object.values(appointments)) {
          stmt.run(appointment.id, appointment.date, appointment.vet, appointment.available)
        }
        stmt.finalize(resolve)
      })
    })

    afterAll(async () => {
      await new Promise((resolve) => {
        db.run('DELETE FROM appointments WHERE id IN (?, ?, ?)', Object.values(appointments).map(appointment => appointment.id), resolve)
      })
    })

    it('books the given appointment if available', async () => {
      const {id, date, vet} = appointments.valid
      await request(app)
        .post('/api/appointments')
        .send({id: appointments.valid.id})
        .expect(200, {message: 'Appointment booked', appointment: {id, date, vet}})

      // and again to ensure it's not available
      await request(app)
        .post('/api/appointments')
        .send({id: appointments.valid.id})
        .expect(409, {message: 'Appointment not available'})
    })

    it('returns an error if the appointment is in the past', async () => {
      await request(app)
        .post('/api/appointments')
        .send({id: appointments.past.id})
        .expect(400, {message: 'Appointment not available'})
    })

    it('returns an error if appointment is already booked', async () => {
      await request(app)
        .post('/api/appointments')
        .send({id: appointments.prebooked.id})
        .expect(409, {message: 'Appointment not available'})
    })
  })
})

describe('GET /api/my/appointments', () => {
  describe('when no appointments are booked', () => {
    it('returns an empty array', async () => {
      await request(app)
        .get('/api/my/appointments')
        .expect(200, {appointments: []})
    })
  })

  describe('when there are booked appointments', () => {
    const appointments = [
      {id: uuid(), date: DateTime.now().plus({hours: 1}).toISO(), vet: 'Dr. Smith', available: 0, client_id: clientId},
      {id: uuid(), date: DateTime.now().minus({hours: 1}).toISO(), vet: 'Dr. Deja Vu', available: 0, client_id: clientId},
    ]

    beforeAll(async () => {
      await new Promise((resolve) => {
        const stmt = db.prepare('INSERT INTO appointments (id, "date", vet, available, client_id) VALUES (?, ?, ?, ?, ?)')
        for (const appointment of Object.values(appointments)) {
          stmt.run(...Object.values(appointment))
        }
        stmt.finalize(resolve)
      })
    })

    afterAll(async () => {
      await new Promise((resolve) => {
        db.run('DELETE FROM appointments WHERE id IN (?, ?)', Object.values(appointments).map(appointment => appointment.id), resolve)
      })
    })

    it('returns the booked appointments', async () => {
      await request(app)
        .get('/api/my/appointments')
        .expect(200, {appointments: appointments.sort((a, b) => a.date.localeCompare(b.date)).map(appointment => ({id: appointment.id, date: appointment.date, vet: appointment.vet}))})
    })
  })
})
