const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-helper')
const UpdateAccessTokenRepository = require('./update-access-token-repository')

let userModel

const makeSut = () => {
  return new UpdateAccessTokenRepository()
}

describe('UpdateAccessTokenRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should throw a new MissingParamError if no user id provided', async () => {
    const sut = makeSut()
    const accessToken = sut.update('', 'any_token')

    await expect(accessToken).rejects.toThrow(new MissingParamError('userId'))
  })

  it('Should throw new MissingParamError if no accessToken is provided', async () => {
    const sut = makeSut()
    const accessToken = sut.update('any_id')

    await expect(accessToken).rejects.toThrow(new MissingParamError('accessToken'))
  })

  it('Should update the user with given id with given accessToken', async () => {
    const sut = makeSut()
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
