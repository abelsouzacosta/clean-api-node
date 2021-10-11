jest.mock('validator', () => ({
  isEmailValid: true,
  email: '',
  isEmail (email) {
    this.email = email

    return this.isEmailValid
  }
}))

const validator = require('validator')
const MissingParamError = require('../errors/missing-param-error')
const EmailValidator = require('./email-validator')

const makeSut = () => new EmailValidator()

describe('Email Validator', () => {
  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid@email.com')

    expect(isEmailValid).toBe(true)
  })

  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    validator.isEmailValid = false
    const isEmailValid = sut.isValid('invalidemail.com')

    expect(isEmailValid).toBe(false)
  })

  it('Should call validator with valid credentials', () => {
    const sut = makeSut()
    sut.isValid('valid@email')

    expect(validator.email).toBe('valid@email')
  })

  it('Should throw a new MissingParamError if an email is not provided', () => {
    const sut = makeSut()
    expect(sut.isValid).toThrow(new MissingParamError('email'))
  })
})
