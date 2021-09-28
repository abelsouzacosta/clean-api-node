const HttpResponse = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body

      if (!email || email === '') {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }

      if (!this.emailValidator.isValid(email)) {
        const invalidError = new InvalidParamError('email')

        return HttpResponse.badRequest(invalidError)
      }

      if (!password || password === '') {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }

      const accessToken = await this.authUseCase.auth(email, password)

      if (!accessToken) {
        return HttpResponse.unauthorizedError()
      }

      return HttpResponse.ok({ accessToken })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
