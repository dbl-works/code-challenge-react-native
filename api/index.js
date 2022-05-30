const express = require('express')
const app = express()
const {DateTime} = require('luxon')

app.listen(3005)
app.use(express.json())

app.get('/api/appointments', (req, res) => {
  const now = DateTime.now()
  const tomorrow = now.plus({days: 1}).toUTC().set({hour: 10, minute: 0, second: 0, millisecond: 0})

  res.json({
    appointments: (new Array(12)).fill(null).map((_, idx) => ({
      date: tomorrow.plus({minutes: idx * 15}).toISO(),
      vet: 'Dr. Smith',
    }))
  })
})

app.post('/api/appointments', (req, res) => {
  const date = DateTime.fromISO(req.body.date) // TODO: Verification

  if (Math.random() > 0.7) {
    res.status(500).json({
      error: 'Could not book appointment',
    })
  } else if (date < DateTime.now()) {
    res.status(400).json({
      error: 'Appointment cannot be in the past',
    })
  } else {
    res.json({
      date: date,
      message: 'Appointment booked',
    })
  }
})
