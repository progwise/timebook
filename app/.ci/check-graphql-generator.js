const simpleGit = require('simple-git')

const git = simpleGit()

git.status().then((status) => {
  if (status.files.length !== 0) {
    console.error('GraphQL Code Generator is not up to date')
    process.exit(1)
  }
})
