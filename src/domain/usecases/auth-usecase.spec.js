class AuthUseCase {
  async auth (email, password) {
    if (!email || email === '') {
      throw new Error()
    }

    if (!password || password === '') {
      throw new Error()
    }
  }
}

const makeSut = () => new AuthUseCase()

describe('Auth Use Case', () => {
  it('Should thorws an exception if no email is provided or the email string is empty', () => {
    const sut = makeSut()
    const promise = sut.auth()

    expect(promise).rejects.toThrow()
  })

  it('Should throws an exception if no password is provided', () => {
    const sut = makeSut()
    const promise = sut.auth('valid@email.com')

    expect(promise).rejects.toThrow()
  })
})
