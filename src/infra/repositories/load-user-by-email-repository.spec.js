const { MissingParamError } = require('../../utils/errors')
const { MongoClient } = require('mongodb')

let client, db

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

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)

  return {
    userModel,
    sut
  }
}

describe('LoadUserByEmailRepostory', () => {
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
    const { sut } = makeSut()

    const user = await sut.load('invalid@mail.com')

    expect(user).toBeNull()
  })

  it('Should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()
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
