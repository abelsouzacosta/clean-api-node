class Encrypter {
  async compare (string, hash) {
    this.string = string
    this.hash = hash
    return true
  }
}

describe('Encrypter', () => {
  it('Should return true when bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_password', 'hashed_password')

    expect(isValid).toBe(true)
  })
})
