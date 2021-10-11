const MissingParamError = require('../errors/missing-param-error')
const jwt = require('jsonwebtoken')

module.exports = class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  validateConstructor () {
    if (!this.secret || this.secret === '') {
      throw new MissingParamError('secret')
    }
  }

  generate (id) {
    if (!id || id === '') {
      throw new MissingParamError('id')
    }

    this.validateConstructor()

    this.id = id

    return jwt.sign({ _id: this.id }, this.secret)
  }
}
