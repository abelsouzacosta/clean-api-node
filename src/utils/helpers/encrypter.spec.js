const bcrypt = require('bcrypt')
const MissingParamError = require('../errors/missing-param-error')

const makeSut = () => {
  class Encrypter {
    async compare (string, hash) {
      if (!string || string === '') {
        throw new MissingParamError('string')
      }

      this.isValid = await bcrypt.compare(string, hash)

      return this.isValid
    }
  }

  const sut = new Encrypter()
  sut.isValid = true

  return sut
}

describe('Encrypter', () => {
  it('Should return true when bcrypt returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_password', 'hashed_password')

    expect(isValid).toBe(true)
  })

  it('Should return false when bcrypt returns false', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_password', 'imcompatible_hash')

    expect(isValid).toBe(false)
  })

  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    await sut.compare('any_string', 'hashed_string')

    expect(bcrypt.string).toBe('any_string')
    expect(bcrypt.hash).toBe('hashed_string')
  })

  it('Should throw a new MissingParamError if an string is not provided', async () => {
    const sut = makeSut()
    const promise = sut.compare()

    expect(promise).rejects.toThrow(new MissingParamError('string'))
  })
})
