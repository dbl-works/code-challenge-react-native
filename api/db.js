const sqlite = require('sqlite3')
const db = new sqlite.Database('database.sqlite')

module.exports = db
