const express = require('express')
const app = express()
const setupApp = require('./setup')

setupApp(app)

app.get('/api/junior', (req, res) => {
  return res.status(200).send('junior')
})

module.exports = app
