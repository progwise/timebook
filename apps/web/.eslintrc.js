/* eslint-disable unicorn/import-style */
/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path')

module.exports = {
  root: true,
  extends: ['custom'],
  ignorePatterns: ['next-env.d.ts', 'coverage'],
  settings: {
    tailwindcss: { config: join(__dirname,  'tailwind.config.js') },
  },
  overrides: [
    {
      files: './frontend/generated/gql/**.ts',
      rules: {
        'unicorn/no-abusive-eslint-disable': 'off',
        'unicorn/filename-case': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
}
