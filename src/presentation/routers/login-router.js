const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email || email === '') {
      return HttpResponse.badRequest('email')
    }

    if (!password || password === '') {
      return HttpResponse.badRequest('password')
    }
  }
}