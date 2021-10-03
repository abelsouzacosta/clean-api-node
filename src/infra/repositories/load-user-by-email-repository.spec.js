const { MissingParamError } = require('../../utils/errors')
const { MongoClient } = require('mongodb')

class LoadUserByEmailRepository {
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

    const user = this.userModel.findOne({ email })

    return user
  }
}

describe('LoadUserByEmailRepostory', () => {
  let client, db

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = client.db('')
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await client.close()
  })

  it('Should return null if no user is found', async () => {
    const userModel = db.collection('users')
    const sut = new LoadUserByEmailRepository(userModel)

    const user = await sut.load('invalid@mail.com')

    expect(user).toBeNull()
  })

  it('Should return an user if user is found', async () => {
    const userModel = db.collection('users')
    await userModel.insertOne({
      email: 'valid@mail.com'
    })

    const sut = new LoadUserByEmailRepository(userModel)
    const user = await sut.load('valid@mail.com')

    expect(user.email).toBe('valid@mail.com')
  })

  it('Should throw a new MissingParamError if an email is not provided', async () => {
    const userModel = db.collection('users')
    const sut = new LoadUserByEmailRepository(userModel)
    const promise = sut.load()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('Should throw a new MissingParamError if an userModel is not provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load('valid@mail.com')

    expect(promise).rejects.toThrow(new MissingParamError('userModel'))
  })
})
