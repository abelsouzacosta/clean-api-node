const makeSut = () => {
  class TokenGenerator {
    generate (id) {
      return this.accessToken
    }
  }

  const tokenGenerator = new TokenGenerator()

  return tokenGenerator
}

describe('Token Generator', () => {
  it('Should return null if JWT returns null', async () => {
    const sut = makeSut()
    sut.accessToken = null
    const accessToken = sut.generate('any_id')

    expect(accessToken).toBeNull()
  })
})
