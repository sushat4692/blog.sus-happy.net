import PostSummaryInterface from '~/interface/PostSummaryInterface'
import PostListInterface from '~/interface/PostListInterface'
import TagRow from '@/interface/TagRow'
import summary from '~/.posts/summary.json'

// Arrange post data
const recents: PostSummaryInterface[] = []
const tags: TagRow[] = []
Object.keys(summary.fileMap).forEach((key: string) => {
  const row: PostSummaryInterface = summary.fileMap[key]
  row.path = key
  row.slug = row.base.split('.')[0]
  recents.push(row)

  if (row.tags) {
    row.tags.forEach((value: string) => {
      const index = tags.findIndex((e: TagRow) => {
        return e.label === value
      })

      if (index < 0) {
        tags.push({
          label: value,
          count: 1
        })
      } else {
        tags[index].count += 1
      }
    })
  }
})
recents.sort((a, b) => {
  const aDate = new Date(a.date).getTime()
  const bDate = new Date(b.date).getTime()
  return aDate === bDate ? 0 : aDate > bDate ? -1 : 1
})

export interface StoreInterface {
  posts: { [key: string]: PostSummaryInterface }
  recents: PostSummaryInterface[]
  tags: TagRow[]
}

export const state = (): StoreInterface => ({
  posts: summary.fileMap as any,
  recents: recents,
  tags
})

export const getters = {
  recent(state: StoreInterface) {
    return (page: number, per_page: number): PostListInterface => {
      const start = (page - 1) * per_page
      const prev = page - 1
      const next = page * per_page < state.recents.length ? page + 1 : 0

      return {
        posts: state.recents.slice(start, start + per_page),
        prev,
        next
      }
    }
  },
  tags(state: StoreInterface) {
    return (tag: string, page: number, per_page: number): PostListInterface => {
      const start = (page - 1) * per_page
      const posts = state.recents.filter(e => {
        if (!e.tags) {
          return false
        }

        return e.tags.some(t => t === tag)
      })

      const prev = page - 1
      const next = page * per_page < posts.length ? page + 1 : 0

      return {
        posts: posts.slice(start, start + per_page),
        prev,
        next
      }
    }
  },
  find(state: StoreInterface) {
    return (slug: string) => {
      const key = '.posts/json/' + slug + '.json'
      if (!state.posts.hasOwnProperty(key)) {
        return null
      }

      return state.posts[key]
    }
  }
}
