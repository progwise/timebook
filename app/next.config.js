/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/no-var-requires */

const withImages = require('next-images')
const config = withImages()
module.exports = {
    ...config,
    eslint: {
        dirs: ['pages', 'hooks', 'components'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
    },
    env: {
        ROOT: __dirname,
    },
}
