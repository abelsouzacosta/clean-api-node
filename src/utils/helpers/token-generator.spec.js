const MissingParamError = require('../errors/missing-param-error')

class TokenGenerator {
  generate (id) {
    if (!id || id === '') {
      throw new MissingParamError('id')
    }

    return this.accessToken
  }
}

const makeSut = () => {
  const tokenGenerator = new TokenGenerator()

  return tokenGenerator
}

describe('Token Generator', () => {
  it('Should return null if JWT returns null', () => {
    const sut = makeSut()
    sut.accessToken = null
    const accessToken = sut.generate('any_id')

    expect(accessToken).toBeNull()
  })

  it('Should throw a new MissingParamException if an id is not provided', () => {
    const sut = new TokenGenerator()
    expect(sut.generate).toThrow(new MissingParamError('id'))
  })
})
