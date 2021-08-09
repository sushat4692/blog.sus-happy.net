import matter from "gray-matter"
import { parseISO, format } from "date-fns"
import fs from "fs"
import { join } from "path"

const postsDirectory = join(process.cwd(), "content", "blog")
export const PER_PAGE = 20

export type BlogContent = {
  slug: string
  frontmatter: {
    title: string
    date: string
    datetime: number
    updated: string
    updatedtime: number
    tags: string[]
    thumbnail: string | null
  }
  content: string
}

export type HeaderContent = {
  level: number
  id: string
  label: string
}[]

export const getPostBySlug = (slug: string): BlogContent => {
  const realSlug = slug.replace(/\.md$/, "")
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

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
        const dateObj = data.date as Date
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
        const dateObj = data.updated as Date
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

  return {
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
    content,
  }
}

export const getAllPosts = () => {
  const slugs = fs.readdirSync(postsDirectory)
  return slugs
    .map(slug => getPostBySlug(slug))
    .sort((a, b) => {
      if (a.frontmatter.datetime === b.frontmatter.datetime) {
        return 0
      }
      return a.frontmatter.datetime < b.frontmatter.datetime ? 1 : -1
    })
}

export const getTagLists = () => {
  const posts = getAllPosts()
  const tags: string[] = []

  posts.forEach(post => {
    post.frontmatter.tags.forEach(tag => {
      tags.push(tag)
    })
  })

  return Array.from(new Set(tags))
}

export const getTagPosts = (tag: string) => {
  const posts = getAllPosts()
  tag = decodeURIComponent(tag)

  return posts.filter(post => {
    return post.frontmatter.tags.some(t => t === tag)
  })
}

export const getNextPrevPosts = (slug: string) => {
  const posts = getAllPosts()
  const index = posts.findIndex(post => post.slug === slug)

  const prev = (() => {
    if (index <= 0) {
      return null
    }

    return posts[index - 1]
  })()

  const next = (() => {
    if (index >= posts.length - 1) {
      return null
    }

    return posts[index + 1]
  })()

  return { prev, next }
}
