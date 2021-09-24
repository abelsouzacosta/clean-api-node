module.exports = class InvalidParamError extends Error {
  constructor (paramName) {
    super(`Invalid param error ${paramName}`)
    this.name = 'InvalidParamError'
  }
}
