const MissingParamError = require('../errors/missing-param-error')
const jwt = require('jsonwebtoken')
const TokenGenerator = require('./token-generator')

const makeSut = () => {
  const tokenGenerator = new TokenGenerator('secret')

  return tokenGenerator
}

describe('Token Generator', () => {
  it('Should throw a new MissingParamError if an id is not provided', () => {
    const sut = makeSut()
    expect(sut.generate).toThrow(new MissingParamError('id'))
  })

  it('Should throw a new MissingParameError if an secret is not provided', () => {
    const sut = new TokenGenerator()

    expect(() => { sut.generate('any_id') }).toThrow(new MissingParamError('secret'))
  })

  it('Should call generate with correct value', () => {
    const sut = makeSut()
    sut.generate('any_id')

    expect(sut.id).toBe(jwt.id)
    expect(sut.secret).toBe(jwt.secret)
  })

  it('Should return null if JWT returns null', () => {
    const sut = makeSut()
    jwt.token = null
    const accessToken = sut.generate('any_id')

    expect(accessToken).toBeNull()
  })

  it('Should return token if JWT retuns token ', () => {
    const sut = makeSut()
    const accessToken = sut.generate('any_id')

    expect(accessToken).toBe(jwt.token)
  })
})
