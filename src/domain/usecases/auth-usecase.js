const { MissingParamError } = require('../../utils/errors')
const { InvalidParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepositorySpy, encrypter, tokenGenerator) {
    this.loadUserByEmailRepositorySpy = loadUserByEmailRepositorySpy
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  validateModuleDependencies () {
    if (!this.loadUserByEmailRepositorySpy) {
      throw new MissingParamError('loadUserByEmailRepositorySpy')
    }

    if (!this.loadUserByEmailRepositorySpy.load) {
      throw new InvalidParamError('loadUserByEmailRepositorySpy')
    }

    if (!this.encrypter) {
      throw new MissingParamError('encrypter')
    }

    if (!this.encrypter.compare) {
      throw new InvalidParamError('encrypter')
    }

    if (!this.tokenGenerator) {
      throw new MissingParamError('tokenGenerator')
    }

    if (!this.tokenGenerator.generate) {
      throw new InvalidParamError('tokenGenerator')
    }
  }

  async auth (email, password) {
    this.validateModuleDependencies()

    if (!email || email === '') {
      throw new MissingParamError('email')
    }

    if (!password || password === '') {
      throw new MissingParamError('password')
    }

    const user = await this.loadUserByEmailRepositorySpy.load(email)

    const isValid = user && await this.encrypter.compare(password, user.password)

    if (isValid) {
      const accessToken = await this.tokenGenerator.generate(user.id)

      return accessToken
    }

    return null
  }
}
