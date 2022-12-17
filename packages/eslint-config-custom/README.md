# central eslint config

To use it in your package inside this turbo mono-repo build an .eslintrc.js file with the content

```js
module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ['custom'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
}
```