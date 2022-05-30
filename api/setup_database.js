const db = require('./db')
const {DateTime} = require('luxon')
const {v4: uuid} = require('uuid')

/**
 * Obtain the name of a random vet.
 *
 * @returns {string}
 */
const randomVet = () => {
  const vets = ['Dr. Smith', 'Dr. Willow', 'Dr. Jones', 'Dr. Brown', 'Dr. White']

  return vets[Math.floor(Math.random() * vets.length)]
}

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS appointments (id BLOB PRIMARY KEY, vet TEXT, "date" TEXT, available INTEGER, client_id BLOB)')
  db.run('DELETE FROM appointments')

  const tomorrow = DateTime.now().plus({days: 1}).toUTC().set({hour: 10, minute: 0, second: 0, millisecond: 0})

  const stmt = db.prepare('INSERT INTO appointments VALUES (?, ?, ?, ?, ?)')
  for (let i = 0; i < 12; ++i) {
    stmt.run(uuid(), randomVet(), tomorrow.plus({minutes: i * 15}).toISO(), 1, null)
  }

  for (let i = 0; i < 4; ++i) {
    stmt.run(uuid(), randomVet(), tomorrow.plus({minutes: i * 45}).toISO(), 1, null)
  }
  stmt.finalize()
})
