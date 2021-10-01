const MissingParamError = require('../errors/missing-param-error')
const jwt = require('jsonwebtoken')

class TokenGenerator {
  generate (id) {
    if (!id || id === '') {
      throw new MissingParamError('id')
    }

    this.id = id

    return jwt.sign(this.id, 'secret')
  }
}

const makeSut = () => {
  const tokenGenerator = new TokenGenerator()

  return tokenGenerator
}

describe('Token Generator', () => {
  it('Should throw a new MissingParamException if an id is not provided', () => {
    const sut = new TokenGenerator()
    expect(sut.generate).toThrow(new MissingParamError('id'))
  })

  it('Should call generate with correct value', () => {
    const sut = makeSut()
    sut.generate('any_id')

    expect(sut.id).toBe('any_id')
  })

  it('Should return null if JWT returns null', () => {
    const sut = makeSut()
    jwt.token = null
    const accessToken = sut.generate('any_id')

    expect(accessToken).toBeNull()
  })

  it('Should return token if JWT retuns token ', () => {
    const sut = makeSut()
    jwt.token = 'any_token'
    const accessToken = sut.generate('any_id')

    expect(accessToken).toBe('any_token')
  })
})
