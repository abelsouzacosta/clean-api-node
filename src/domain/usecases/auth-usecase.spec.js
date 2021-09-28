const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email, password) {
    if (!email || email === '') {
      throw new MissingParamError('email')
    }

    if (!password || password === '') {
      throw new MissingParamError('password')
    }
  }
}

const makeSut = () => new AuthUseCase()

describe('Auth Use Case', () => {
  it('Should thorws an exception if no email is provided or the email string is empty', () => {
    const sut = makeSut()
    const promise = sut.auth()

    expect(promise).rejects.toEqual(new MissingParamError('email'))
  })

  it('Should throws an exception if no password is provided', () => {
    const sut = makeSut()
    const promise = sut.auth('valid@email.com')

    expect(promise).rejects.toEqual(new MissingParamError('password'))
  })
})
