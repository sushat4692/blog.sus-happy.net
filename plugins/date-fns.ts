import { Plugin } from '@nuxt/types'
import { formatDistanceToNow, parseISO } from 'date-fns'

const plugin: Plugin = (_context, inject) => {
  inject('formatDistanceToNow', (string: string) => {
    const date = parseISO(string)
    if (!date) {
      return ''
    }
    return formatDistanceToNow(date)
  })
}

export default plugin
