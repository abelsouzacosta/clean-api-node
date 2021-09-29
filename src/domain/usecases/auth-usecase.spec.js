const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword

      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositoty {
    async load (email) {
      this.email = email

      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositoty()
  loadUserByEmailRepositorySpy.user = {
    password: 'hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy)

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy
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

  it('Should throw a new MissinParamexception exception if the encrypter was not provided', async () => {
    const { loadUserByEmailRepositorySpy } = makeSut()
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
    const promise = sut.auth('valid@mail.com', 'valid_password')

    expect(promise).rejects.toThrow(new MissingParamError('encrypter'))
  })

  it('Should throw a new InvalidParamException if the encrypter doesnt have compare method', async () => {
    const { loadUserByEmailRepositorySpy } = makeSut()
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy, {})

    const promise = sut.auth('valid@mail.com', 'any_password')

    expect(promise).rejects.toThrow(new InvalidParamError('encrypter'))
  })

  it('Should return null if an invalid email are provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('invalid@mail.com', 'any_password')

    expect(accessToken).toBeNull()
  })

  it('Should return null if an invalid password are provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('valid@mail.com', 'invalid_password')

    expect(accessToken).toBeNull()
  })

  it('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()

    await sut.auth('valid@email.com', 'any_password')

    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })
})
