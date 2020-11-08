const path = require("path")
const imagemin = require("imagemin")
const imageminMozjpeg = require("imagemin-mozjpeg")
const imageminPngquant = require("imagemin-pngquant")
const imageminSvgo = require("imagemin-svgo")
const glob = require("glob")
const gbase = require("glob-base")

const targetPattern = "original/**/*.{jpg,jpeg,png,svg}"
const targetOutput = "public"
;(async () => {
  const files = glob.sync(targetPattern)
  const base = gbase(targetPattern)

  await Promise.all(
    files.map(async file => {
      try {
        const basedir = path.dirname(__dirname)
        const output = path.dirname(
          path.join(basedir, targetOutput, path.relative(base.base, file))
        )
        file = path.join(basedir, file)

        await imagemin([file], output, {
          glob: false,
          plugins: [
            imageminMozjpeg({ quality: 80 }),
            imageminPngquant({ quality: "65-80" }),
            imageminSvgo(),
          ],
        })

        console.log(`Done ${file}`)
        console.log(` -> ${output}`)
      } catch (e) {
        throw e
      }
    })
  )
})()
