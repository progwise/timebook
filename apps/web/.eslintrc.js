module.exports = {
  root: true,
  extends: ['custom'],
  ignorePatterns: ['next-env.d.ts', 'coverage'],
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
