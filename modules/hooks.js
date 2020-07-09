import { existsSync, mkdirSync } from 'fs'

module.exports = function () {
  const staticPath = this.options.buildDir
  this.nuxt.hook('generate:before', () => {
    if (!existsSync(staticPath)) {
      mkdirSync(staticPath)
    }
  })
}
