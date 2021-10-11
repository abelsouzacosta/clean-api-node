const LoginRouter = require('../../presentation/routers/login-router')
const AuthUseCase = require('../../domain/usecases/auth-usecase')
const EmailValidator = require('../../utils/helpers/email-validator')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository')
const Encrypter = require('../../utils/helpers/encrypter')
const TokenGenerator = require('../../utils/helpers/token-generator')
const env = require('../config/env')

module.exports = router => {
  const loadUserByEmailRepository = new LoadUserByEmailRepository()
  const updateAccessTokenRepository = new UpdateAccessTokenRepository()
  const encrypter = new Encrypter()
  const tokenGenerator = new TokenGenerator(env.tokenSecret)
  const authUseCase = new AuthUseCase({
    loadUserByEmailRepository,
    encrypter,
    tokenGenerator,
    updateAccessTokenRepository
  })
  const emailValidator = new EmailValidator()
  const loginRouter = new LoginRouter(authUseCase, emailValidator)
  router.post('/login', loginRouter.route)
}
