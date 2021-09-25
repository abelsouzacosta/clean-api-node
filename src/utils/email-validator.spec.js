const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid@email.com')

    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator returns false', () => {
    const sut = new EmailValidator()
    validator.isEmailValid = false
    const isEmailValid = sut.isValid('invalidemail.com')

    expect(isEmailValid).toBe(false)
  })
})
