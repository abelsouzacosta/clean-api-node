const makeSut = () => {
  class Encrypter {
    async compare (string, hash) {
      this.string = string
      this.hash = hash
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
    sut.isValid = false

    const isValid = await sut.compare('any_password', 'imcompatible_hash')

    expect(isValid).toBe(false)
  })
})
