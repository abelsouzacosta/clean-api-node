const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

const makeSut = () => new EmailValidator()

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid@email.com')

    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    validator.isEmailValid = false
    const isEmailValid = sut.isValid('invalidemail.com')

    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with valid credentials', () => {
    const sut = makeSut()
    sut.isValid('valid@email')

    expect(validator.email).toBe('valid@email')
  })
})
