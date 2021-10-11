const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-helper')

module.exports = class UpdateAccessTokenRepository {
  async update (userId, accessToken) {
    if (!userId || userId === '') {
      throw new MissingParamError('userId')
    }

    if (!accessToken || accessToken === '') {
      throw new MissingParamError('accessToken')
    }

    const db = await MongoHelper.getDb()

    await db.collection('users').updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}
