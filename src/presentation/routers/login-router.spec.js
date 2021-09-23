class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email || email === '') {
      return HttpResponse.badRequest()
    }

    if (!password || password === '') {
      return HttpResponse.badRequest()
    }
  }
}

class HttpResponse {
  static badRequest () {
    return {
      statusCode: 400
    }
  }

  static serverError () {
    return {
      statusCode: 500
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

  test('Should return 500 if an httpRequest is not provided', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if the httpRequest has no body', () => {
    const sut = new LoginRouter()
    const httpRequest = {

    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
