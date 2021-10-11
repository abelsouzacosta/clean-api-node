const LoginRouterComposer = require('../composers/login-router-composer')
const { adapt } = require('../adapters/express-router-adapter')

module.exports = router => {
  const loginRouterComposer = LoginRouterComposer.compose()
  router.post('/login', adapt(loginRouterComposer))
}
