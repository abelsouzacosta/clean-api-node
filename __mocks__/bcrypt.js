module.exports = {
  isValid: true,
  string: '',
  hash: '',
  async compare (string, hash) {
    this.string = string
    this.hash = hash

    return this.isValid
  }
}
