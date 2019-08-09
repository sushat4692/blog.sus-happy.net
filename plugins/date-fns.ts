import { distanceInWordsToNow, parse } from 'date-fns'

export default ({ app }, inject) => {
  inject('distanceInWordsToNow', (string: string) => {
    const date = parse(string)
    if (!date) {
      return ''
    }
    return distanceInWordsToNow(date)
  })
}
