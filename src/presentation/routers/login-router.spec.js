class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.body.email || httpRequest.body.email === '') {
      return {
        statusCode: 400
      }
    }

    if (!httpRequest.body.password || httpRequest.body.password === '') {
      return {
        statusCode: 400
      }
    }
  }
}

describe('Login router', () => {
  test('Should return 400 if an email is not provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 400 if an password is not provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: ''
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })
})
