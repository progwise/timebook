const { ignorePatterns } = require('../web/.eslintrc')

module.exports = {
  root: true,
  extends: ['custom', 'plugin:stream-deck'],
  ignorePatterns: [...ignorePatterns],
}
