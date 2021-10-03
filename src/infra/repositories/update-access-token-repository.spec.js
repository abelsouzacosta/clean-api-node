const MissingParamError = require('../../utils/errors/missing-param-error')

class UpdateAccessTokenRepository {
  async update (token) {
    if (!token || token === '') {
      throw new MissingParamError('token')
    }
  }
}

describe('UpdateAccessTokenRepository', () => {
  it('Should throw new MissingParamError if no token is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const accessToken = sut.update()

    await expect(accessToken).rejects.toThrow(new MissingParamError('token'))
  })
})
