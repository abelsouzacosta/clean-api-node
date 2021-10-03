const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  validateConstructor () {
    if (!this.userModel) {
      throw new MissingParamError('userModel')
    }
  }

  async load (email) {
    this.validateConstructor()

    if (!email || email === '') {
      throw new MissingParamError('email')
    }

    const user = this.userModel.findOne({
      email
    }, {
      projection: {
        password: 1
      }
    })

    return user
  }
}
