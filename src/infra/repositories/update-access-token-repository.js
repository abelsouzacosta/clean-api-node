const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  validateConstructor () {
    if (!this.userModel) {
      throw new MissingParamError('userModel')
    }
  }

  async update (userId, accessToken) {
    if (!userId || userId === '') {
      throw new MissingParamError('userId')
    }

    if (!accessToken || accessToken === '') {
      throw new MissingParamError('accessToken')
    }

    this.validateConstructor()

    this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}
