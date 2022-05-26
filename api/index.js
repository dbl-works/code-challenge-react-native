const express = require('express');
const app = express();
const {DateTime} = require('luxon');

app.listen(3005);
app.get('/api/appointment', (req, res) => {
  const now = DateTime.now();
  const tomorrow = now.plus({days: 1}).toUTC().set({hour: 10, minute: 0, second: 0, millisecond: 0});

  res.json({
    appointments: (new Array(12)).fill(null).map((_, idx) => ({
      date: tomorrow.plus({minutes: idx * 15}).toISO(),
      vet: 'Dr. Smith',
    }))
  });
});

app.post('/api/appointment', (req, res) => {
  if (Math.random() > 0.7) {
    res.status(400).json({
      error: 'Appointment not available',
    });
  } else {
    res.json({
      date: req.body.date,
      message: 'Appointment booked',
    });
  }
});
