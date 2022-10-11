module.exports = {
  root: true,
  extends: ['custom'],
  ignorePatterns: ['next-env.d.ts', 'coverage', 'backend/graphql/generated/nexus-typegen.ts'],
  overrides: [
    {
      files: ['e2e-tests/**/*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:unicorn/recommended',
        'plugin:playwright/playwright-test',
      ],
    },
  ],
}
