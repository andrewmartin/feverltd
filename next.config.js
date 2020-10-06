/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  generateBuildId: async () => {
    // eslint-disable-next-line global-require
    const HEAD = require('./HEAD.js')
    // eslint-disable-next-line no-console
    console.info(`buildId: ${HEAD}`)

    return HEAD
  },
}
