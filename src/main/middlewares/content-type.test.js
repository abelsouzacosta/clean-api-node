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

  it('Should return xml content type if forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      return res.status(200).send('')
    })

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
