const { MissingParamError, InvalidParamError } = require('../../utils/errors')

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

    if (!this.loadUserByEmailRepositorySpy) {
      throw new MissingParamError('loadUserByEmailRepositorySpy')
    }

    if (!this.loadUserByEmailRepositorySpy.load) {
      throw new InvalidParamError('loadUserByEmailRepositorySpy')
    }

    const user = await this.loadUserByEmailRepositorySpy.load(email)

    if (!user) {
      return null
    }
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositoty {
    async load (email) {
      this.email = email
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositoty()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)

  return {
    sut,
    loadUserByEmailRepositorySpy
  }
}

describe('Auth Use Case', () => {
  it('Should thorws an exception if no email is provided or the email string is empty', () => {
    const { sut } = makeSut()
    const promise = sut.auth()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('Should throws an exception if no password is provided', () => {
    const { sut } = makeSut()
    const promise = sut.auth('valid@email.com')

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  it('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('valid@mail.com', '123')

    expect(loadUserByEmailRepositorySpy.email).toBe('valid@mail.com')
  })

  it('Should throw a new MissingParamError exception if the loadUserByEmailRepository was not provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('valid@mail.com', '123')

    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepositorySpy'))
  })

  it('Should throw a new InvalidParamError exception if the loadUserByEmailRepository doesnt have the load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('valid@mail.com', '123')

    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepositorySpy'))
  })

  it('Should return null if invalid credentials are provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('invalid@mail.com', 'invalid_password')

    expect(accessToken).toBeNull()
  })
})
