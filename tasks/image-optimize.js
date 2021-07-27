const path = require("path")
const { ImagePool } = require("@squoosh/lib")
const { fromFile } = require("file-type")
const { optimize } = require("svgo")
const { readFileSync, writeFile } = require("fs-extra")
const glob = require("glob")
const gbase = require("glob-base")

const targetPattern = "original/**/*.{jpg,jpeg,png,svg}"
const targetOutput = "public"

const binaryOptimize = async (imagePool, file) => {
  const type = await fromFile(file)
  if (!type) {
    return
  }

  const image = imagePool.ingestImage(file)
  const rawEncodedImage = await (async () => {
    switch (type.mime) {
      case "image/jpeg":
        await image.encode({
          mozjpeg: {},
        })
        return (await image.encodedWith.mozjpeg).binary
      case "image/png":
        await image.encode({
          oxipng: {},
        })
        return (await image.encodedWith.oxipng).binary
      default:
        return null
    }
  })()

  if (!rawEncodedImage) {
    return
  }

  return rawEncodedImage
}

const svgOptimize = async file => {
  const string = readFileSync(file).toString()
  const optimized = await optimize(string)
  if (optimized.error) {
    console.log(optimized.error)
    return
  }

  const encoder = new TextEncoder()
  return encoder.encode(optimized.data)
}

;(async () => {
  const imagePool = new ImagePool()
  const files = glob.sync(targetPattern)
  const base = gbase(targetPattern)

  for (let i = 0; i < files.length; i += 1) {
    const f = files[i]

    try {
      const basedir = path.dirname(__dirname)
      const output = path.join(
        basedir,
        targetOutput,
        path.relative(base.base, f)
      )
      const file = path.join(basedir, f)

      console.log(`Start ${file}`)

      const ext = path.extname(file)
      const rawEncodedImage = await (async () => {
        if (ext === ".svg") {
          return await svgOptimize(file)
        }

        return await binaryOptimize(imagePool, file)
      })()

      if (!rawEncodedImage) {
        continue
      }

      await writeFile(output, rawEncodedImage)

      console.log(`Done ${file}`)
      console.log(` -> ${output}`)
    } catch (e) {
      throw e
    }
  }

  imagePool.close()
})()
