const MissingParamError = require('../errors/missing-param-error')
const bcrypt = require('bcrypt')

module.exports = class Encrypter {
  async compare (string, hash) {
    if (!string || string === '') {
      throw new MissingParamError('string')
    }

    if (!hash || hash === '') {
      throw new MissingParamError('hash')
    }

    this.isValid = await bcrypt.compare(string, hash)

    return this.isValid
  }
}
