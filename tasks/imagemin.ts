import path from 'path'
import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import glob from 'glob'
import gbase from 'glob-base'

const targetPattern = 'original/**/*.{jpg,jpeg,png,svg}'
const targetOutput = 'static'
;(async () => {
  const files = glob.sync(targetPattern)
  const base = gbase(targetPattern)

  await Promise.all(
    files.map(async (file) => {
      const destination = path.dirname(
        path.join(targetOutput, path.relative(base.base, file))
      )

      await imagemin([file], {
        destination,
        glob: false,
        plugins: [
          imageminMozjpeg(),
          imageminPngquant({
            quality: [0.6, 0.8]
          }),
          imageminSvgo()
        ]
      })
    })
  )
})()
