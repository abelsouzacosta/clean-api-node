const request = require('supertest')

describe('Content Type', () => {
  let app

  beforeEach(() => {
    jest.resetModules()
    app = require('../config/app')
  })

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
      res.send('')
    })

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
