const {DateTime} = require("luxon")
const db = require("./db")
const {clientId} = require("./constants")

exports.listAppointments = async (req, res) => {
  const now = DateTime.now()
  const appointments = []

  await new Promise((resolve, reject) => {
    db.each('SELECT id, "date", vet FROM appointments WHERE "date" >= ? AND available = 1 ORDER BY "date" ASC', now.toISO(), (err, row) => {
      appointments.push(row)
    }, resolve)
  })

  res.json({
    appointments
  })
}

exports.createAppointment = async (req, res) => {
  const {id} = req.body

  const exists = await new Promise((resolve) => {
    db.get('SELECT id, "date", vet, available FROM appointments WHERE id = ?', id, (err, row) => {
      resolve(row)
    })
  })

  if (!exists) {
    res.status(400).json({message: 'Appointment not available'})
    return
  }

  if (!exists.available) {
    res.status(409).json({message: 'Appointment not available'})
    return
  }

  if (DateTime.fromISO(exists.date) < DateTime.now()) {
    res.status(400).json({message: 'Appointment not available'})
    return
  }

  if (process.env.NODE_ENV !== 'test' && Math.random() > 0.7) {
    db.run('UPDATE appointments SET available = 0, client_id = ? WHERE id = ?', [uuid(), id])
    res.status(409).json({
      error: 'Could not book appointment',
    })
  } else {
    let appointment
    await new Promise((resolve) => {
      db.run('UPDATE appointments SET available = 0, client_id = ? WHERE id = ?', [clientId, req.body.id], () => {
        db.get('SELECT id, "date", vet FROM appointments WHERE id = ?', id, (err, row) => {
          appointment = row
          resolve()
        })
      })
    })

    res.json({
      appointment,
      message: 'Appointment booked',
    })
  }
}

exports.listMyAppointments = async (req, res) => {
  let appointments = []

  await new Promise((resolve) => {
    db.all('SELECT id, "date", vet FROM appointments WHERE client_id = ? ORDER BY "date"', [clientId], (err, rows) => {
      appointments = rows
      resolve()
    })
  })

  res.json({
    appointments
  })
}
