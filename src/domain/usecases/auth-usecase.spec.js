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
    id: 'any_id',
    password: 'hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    generate (id) {
      this.userId = id

      return this.accessToken
    }
  }

  const tokenGenerator = new TokenGeneratorSpy()
  tokenGenerator.accessToken = 'any_token'
  return tokenGenerator
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessToken {
    async update (userId, token) {
      this.token = token
      this.userId = userId
    }
  }

  const updateAccessToken = new UpdateAccessToken()

  return updateAccessToken
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
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

  it('Should throw if no dependency is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('valid@mail.com', 'any_password')

    expect(promise).rejects.toThrow()
  })

  it('Should throw a new MissingParamError exception if the loadUserByEmailRepository was not provided', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('valid@mail.com', '123')

    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })

  it('Should throw a new InvalidParamError exception if the loadUserByEmailRepository doesnt have the load method', async () => {
    const sut = new AuthUseCase({ loadUserByEmailRepository: {} })
    const promise = sut.auth('valid@mail.com', '123')

    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })

  it('Should throw a new MissinParamError if the encrypter was not provided', async () => {
    const { loadUserByEmailRepositorySpy } = makeSut()
    const sut = new AuthUseCase({ loadUserByEmailRepository: loadUserByEmailRepositorySpy })
    const promise = sut.auth('valid@mail.com', 'valid_password')

    expect(promise).rejects.toThrow(new MissingParamError('encrypter'))
  })

  it('Should throw a new InvalidParamError if the encrypter doesnt have compare method', async () => {
    const { loadUserByEmailRepositorySpy } = makeSut()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: {}
    })

    const promise = sut.auth('valid@mail.com', 'any_password')

    expect(promise).rejects.toThrow(new InvalidParamError('encrypter'))
  })

  it('Should throw a new MissingParamError if the token generator was not provided', async () => {
    const { loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy
    })

    const promise = sut.auth('valid@mail.com', 'any_password')

    expect(promise).rejects.toThrow(new MissingParamError('tokenGenerator'))
  })

  it('Should throw a new InvalidParamError if the TokenGenerator doesnt have generate method', async () => {
    const { loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: {}
    })

    const promise = sut.auth('valid@mail.com', 'any_password')

    expect(promise).rejects.toThrow(new InvalidParamError('tokenGenerator'))
  })

  it('Should throw a new MissingParamError if UpdateAccessToken is not provided', async () => {
    const { loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy } = makeSut()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy
    })

    const promise = sut.auth('valid@mail.com', 'any_password')

    expect(promise).rejects.toThrow(new MissingParamError('updateAccessTokenRepository'))
  })

  it('Should throw a new InvalidParamError if UpdateAccessToken doenst have update method', async () => {
    const { loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy } = makeSut()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy,
      updateAccessTokenRepository: {}
    })

    const promise = sut.auth('valid@mail.com', 'any_password')

    expect(promise).rejects.toThrow(new InvalidParamError('updateAccessTokenRepository'))
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

  it('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid@mail.com', 'valid_password')

    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  it('Should return an access token if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid@mail.com', 'valid_password')

    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, updateAccessTokenRepositorySpy } = makeSut()
    await sut.auth('valid@mail.com', 'valid_password')

    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })
})
