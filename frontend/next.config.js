// eslint-disable-next-line @typescript-eslint/no-var-requires
const withImages = require('next-images')
module.exports = withImages()
module.exports = {
    eslint: {
        dirs: ['pages', 'hooks', 'components'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
    },
}
