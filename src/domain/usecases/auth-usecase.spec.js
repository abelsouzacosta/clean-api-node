const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

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
