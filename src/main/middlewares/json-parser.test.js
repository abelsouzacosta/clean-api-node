const request = require('supertest')
const app = require('../config/app')

describe('Json Parser', () => {
  it('Should parse body as JSON ', async () => {
    app.post('/test_json_parser', (req, res) => {
      return res.status(200).send(req.body)
    })

    await request(app)
      .post('/test_json_parser')
      .send({ name: 'Junior' })
      .expect({ name: 'Junior' })
  })
})
