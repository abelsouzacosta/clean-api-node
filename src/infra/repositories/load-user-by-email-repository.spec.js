class LoadUserByEmailRepository {
  async load (email) {
    return this.user
  }
}

describe('LoadUserByEmailRepostory', () => {
  it('Should return null if an user is not found', async () => {
    const sut = new LoadUserByEmailRepository()
    sut.user = null
    const user = await sut.load('invalid@mail.com')

    expect(user).toBeNull()
  })
})
