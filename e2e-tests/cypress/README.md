# timeebook cypress testing

This is how this project has been build

# Init Steps

1. npm init -y
2. npm i cypress
3. npm i typescript
4. npm i ts-node
5. add package.json script "cypress open"
   ```json
    ...
     "scripts": {
        "test": "cypress open",
        "start:frontend": "npm run dev --prefix ../../frontend"
        "test:unit": "concurrently --kill-others \"npm run start:frontend\" \"npm test\"",
        ...
    },
    ...
    ```
6. add tsconfig.json
   ```json
    {
        "compilerOptions": {
            "target": "es5",
            "lib": ["es5","dom"],
            "types": ["cypress", "node"],
            "moduleResolution": "Node",
            "typeRoots": ["./node_modules/@types"]
        },
        "include": ["**/*.ts"]
    }
    ```
7. add eslint  
   ```shell
   npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-cypress
   ```
    .eslintrc
    ```json
    {
        "parser": "@typescript-eslint/parser",
        "plugins": ["cypress"],
        "extends": ["plugin:cypress/recommended"]
    }
    ```
8. add prettier



...and just run the build-in examples

```shell
npm test
```

# Writing a test

```typescript
describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  })
})
```

## Most important cy-commands

* cy.visit
* cy.get & cy.contains => https://docs.cypress.io/api/commands/contains
* cy.url
* chai assertions with should... => https://docs.cypress.io/api/commands/should
*

# Links
https://docs.cypress.io/

