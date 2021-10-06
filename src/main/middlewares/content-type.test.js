const request = require('supertest')
const app = require('../config/app')

describe('Content Type', () => {
  it('Should return content type', async () => {
    app.get('/test_content_type', (req, res) => {
      return res.status(200).send('')
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})
