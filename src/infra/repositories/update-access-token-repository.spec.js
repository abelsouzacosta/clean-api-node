const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-helper')
let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  validateConstructor () {
    if (!this.userModel) {
      throw new MissingParamError('userModel')
    }
  }

  async update (token, userId) {
    if (!token || token === '') {
      throw new MissingParamError('token')
    }

    if (!userId || userId === '') {
      throw new MissingParamError('userId')
    }

    this.validateConstructor()
  }
}

describe('UpdateAccessTokenRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should throw new MissingParamError if no token is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const accessToken = sut.update()

    await expect(accessToken).rejects.toThrow(new MissingParamError('token'))
  })

  it('Should throw a new MissingParamError if no user id provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const accessToken = sut.update('any_token')

    await expect(accessToken).rejects.toThrow(new MissingParamError('userId'))
  })

  it('Should throw a new MissingParamError if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const accessToken = sut.update('valid_token', 'valid_id')

    await expect(accessToken).rejects.toThrow(new MissingParamError('userModel'))
  })
})
