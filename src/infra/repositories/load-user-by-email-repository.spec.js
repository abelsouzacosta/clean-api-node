const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

let userModel

const makeSut = () => {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmailRepostory', () => {
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

  it('Should return null if no user is found', async () => {
    const sut = makeSut()

    const user = await sut.load('invalid@mail.com')

    expect(user).toBeNull()
  })

  it('Should return an user if user is found', async () => {
    const sut = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })
    const user = await sut.load('valid@mail.com')

    expect(user._id).toEqual(fakeUser.insertedId)
  })

  it('Should throw a new MissingParamError if an email is not provided', async () => {
    const sut = makeSut()
    const promise = sut.load()

    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
