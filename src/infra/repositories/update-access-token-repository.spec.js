const MissingParamError = require('../../utils/errors/missing-param-error')

class UpdateAccessTokenRepository {
  async update (token, userId) {
    if (!token || token === '') {
      throw new MissingParamError('token')
    }

    if (!userId || userId === '') {
      throw new MissingParamError('userId')
    }
  }
}

describe('UpdateAccessTokenRepository', () => {
  it('Should throw new MissingParamError if no token is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const accessToken = sut.update()

    await expect(accessToken).rejects.toThrow(new MissingParamError('token'))
  })

  it('Should throw a new MissingParamError if no user id provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const accessToken = sut.update('any_token')

    await expect(accessToken).rejects.toThrow(new MissingParamError('userId'))
  })
})
