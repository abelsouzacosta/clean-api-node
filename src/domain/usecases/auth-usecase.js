const { MissingParamError } = require('../../utils/errors')
const { InvalidParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepositorySpy, encrypter) {
    this.loadUserByEmailRepositorySpy = loadUserByEmailRepositorySpy
    this.encrypter = encrypter
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

    if (!user) {
      return null
    }

    await this.encrypter.compare(password, user.password)

    return null
  }
}
