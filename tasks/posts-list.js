const path = require("path")
const glob = require("glob")
const fs = require("fs")
const matter = require("gray-matter")
const { parseISO, format } = require("date-fns")

const targetPattern = "content/blog/**/*.md"
const targetOutput = "pages/api/[slug]"

;(async () => {
  const results = []
  const files = glob.sync(targetPattern)

  for (let i = 0; i < files.length; i += 1) {
    const f = files[i]

    try {
      const basedir = path.dirname(__dirname)
      const file = path.join(basedir, f)
      const slug = path.basename(file)

      console.log(`Start ${file}`)

      const realSlug = slug.replace(/\.md$/, "")
      const fileContents = fs.readFileSync(file, "utf8")
      const { data } = matter(fileContents)

      // Title
      const title = (() => {
        if (Object.prototype.hasOwnProperty.call(data, "title")) {
          return data.title
        } else {
          return ""
        }
      })()

      // Get Date
      const { date, datetime } = (() => {
        if (Object.prototype.hasOwnProperty.call(data, "date")) {
          if (typeof data.date === "object") {
            const dateObj = data.date
            return {
              date: format(dateObj, "MMMM dd, yyyy"),
              datetime: dateObj.getTime(),
            }
          } else {
            const dateObj = parseISO(data.date)
            return {
              date: format(dateObj, "MMMM dd, yyyy"),
              datetime: dateObj.getTime(),
            }
          }
        } else {
          return { date: "", datetime: 0 }
        }
      })()

      // Get Updated
      const { updated, updatedtime } = (() => {
        if (Object.prototype.hasOwnProperty.call(data, "updated")) {
          if (typeof data.updated === "object") {
            const dateObj = data.updated
            return {
              updated: format(dateObj, "MMMM dd, yyyy"),
              updatedtime: dateObj.getTime(),
            }
          } else {
            const dateObj = parseISO(data.updated)
            return {
              updated: format(dateObj, "MMMM dd, yyyy"),
              updatedtime: dateObj.getTime(),
            }
          }
        } else {
          return { updated: "", updatedtime: 0 }
        }
      })()

      // Tags
      const tags = (() => {
        if (Object.prototype.hasOwnProperty.call(data, "tags")) {
          if (data.tags) {
            if (Array.isArray(data.tags)) {
              return [...data.tags]
            } else {
              return [data.tags]
            }
          } else {
            return []
          }
        } else {
          return []
        }
      })()

      // Title
      const thumbnail = (() => {
        if (Object.prototype.hasOwnProperty.call(data, "thumbnail")) {
          return data.thumbnail
        } else {
          return null
        }
      })()

      results.push({
        slug: realSlug,
        frontmatter: {
          title,
          date,
          datetime,
          updated,
          updatedtime,
          tags,
          thumbnail,
        },
      })
    } catch (e) {
      throw e
    }
  }

  fs.writeFileSync(
    path.join(targetOutput, "posts.json"),
    JSON.stringify(results)
  )
})()
