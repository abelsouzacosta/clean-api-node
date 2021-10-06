const request = require('supertest')
const app = require('../config/app')

describe('Setup App', () => {
  it('Should enable cors', async () => {
    app.get('/test_cors', (req, res) => {
      return res.status(200).send('')
    })

    const res = await request(app).get('/test_cors')

    expect(res.headers['access-control-allow-origin']).toBe('*')
  })

  it('Should enable headers cors', async () => {
    app.get('/test_cors_headers', (req, res) => {
      return res.status(200).send('')
    })

    const res = await request(app).get('/test_cors_headers')

    expect(res.headers['access-control-allow-headers']).toBe('*')
  })

  it('Should enable method cors', async () => {
    app.get('/test_cors_methods', (req, res) => {
      return res.status(200).send('')
    })

    const res = await request(app).get('/test_cors_methods')

    expect(res.headers['access-control-allow-methods']).toBe('*')
  })
})
