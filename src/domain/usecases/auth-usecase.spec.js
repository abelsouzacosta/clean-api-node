const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (loadUserByEmailRepositorySpy) {
    this.loadUserByEmailRepositorySpy = loadUserByEmailRepositorySpy
  }

  async auth (email, password) {
    if (!email || email === '') {
      throw new MissingParamError('email')
    }

    if (!password || password === '') {
      throw new MissingParamError('password')
    }

    await this.loadUserByEmailRepositorySpy.load(email)
  }
}

const makeSut = () => new AuthUseCase()

describe('Auth Use Case', () => {
  it('Should thorws an exception if no email is provided or the email string is empty', () => {
    const sut = makeSut()
    const promise = sut.auth()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('Should throws an exception if no password is provided', () => {
    const sut = makeSut()
    const promise = sut.auth('valid@email.com')

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  it('Should call LoadUserByEmailRepository with correct email', async () => {
    class LoadUserByEmailRepositoty {
      async load (email) {
        this.email = email
      }
    }
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositoty()
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
    await sut.auth('valid@mail.com', '123')

    expect(loadUserByEmailRepositorySpy.email).toBe('valid@mail.com')
  })
})
