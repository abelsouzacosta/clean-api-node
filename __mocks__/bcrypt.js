module.exports = {
  isValid: true,
  async compare (string, hash) {
    this.string = string
    this.hash = hash

    return this.isValid
  }
}
