const { MissingParamError } = require('../../utils/errors')

class LoadUserByEmailRepository {
  async load (email) {
    if (!email || email === '') {
      throw new MissingParamError('email')
    }

    return this.user
  }
}

describe('LoadUserByEmailRepostory', () => {
  it('Should return null if an user is not found', async () => {
    const sut = new LoadUserByEmailRepository()
    sut.user = null
    const user = await sut.load('invalid@mail.com')

    expect(user).toBeNull()
  })

  it('Should throw a new MissinParamError if en email is not provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
