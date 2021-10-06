const request = require('supertest')
const app = require('./app')

describe('Setup App', () => {
  it('Should disable x-powered-by header of the express', async () => {
    app.get('/api/teste_x_powered_by', (req, res) => {
      return res.status(200).send('')
    })

    const res = await request(app).get('/api/teste_x_powered_by')

    expect(res.headers['x-powered-by']).toBeUndefined()
  })
})
