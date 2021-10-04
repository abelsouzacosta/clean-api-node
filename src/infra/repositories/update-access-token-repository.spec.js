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

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)

  return {
    sut,
    userModel
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

  it('Should throw a new MissingParamError if no user id provided', async () => {
    const { sut } = makeSut()
    const accessToken = sut.update('', 'any_token')

    await expect(accessToken).rejects.toThrow(new MissingParamError('userId'))
  })

  it('Should throw new MissingParamError if no accessToken is provided', async () => {
    const { sut } = makeSut()
    const accessToken = sut.update('any_id')

    await expect(accessToken).rejects.toThrow(new MissingParamError('accessToken'))
  })

  it('Should throw a new MissingParamError if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const accessToken = sut.update('valid_id', 'valid_token')

    await expect(accessToken).rejects.toThrow(new MissingParamError('userModel'))
  })

  it('Should update the user with given id with given accessToken', async () => {
    const { sut, userModel } = makeSut()
    const mockUser = await userModel.insertOne({
      email: 'valid@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })

    await sut.update(mockUser.insertedId, 'valid_token')

    const insertedMockUser = await userModel.findOne({
      _id: mockUser.insertedId
    })

    await expect(insertedMockUser.accessToken).toBe('valid_token')
  })
})
