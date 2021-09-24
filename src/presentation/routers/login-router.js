const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    if (!this.authUseCase || !this.authUseCase.auth) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email || email === '') {
      return HttpResponse.badRequest('email')
    }

    if (!password || password === '') {
      return HttpResponse.badRequest('password')
    }

    const accessToken = this.authUseCase.auth(email, password)

    if (!accessToken) {
      return HttpResponse.unauthorizedError()
    }

    return HttpResponse.ok()
  }
}
