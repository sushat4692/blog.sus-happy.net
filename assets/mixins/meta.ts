export default {
  head() {
    const vue = this as any

    const meta = [
      { hid: 'description', name: 'description', content: vue.meta.description },
      { hid: 'og:type', property: 'og:type', content: vue.meta.type },
      { hid: 'og:title', property: 'og:title', content: vue.meta.title },
      { hid: 'og:description', property: 'og:description', content: vue.meta.description },
      { hid: 'og:url', property: 'og:url', content: process.env.URL + vue.meta.url }
    ]

    if (vue.meta.hasOwnProperty('image') && vue.meta.image) {
      meta.push({ hid: 'og:image', property: 'og:image', content: process.env.URL + vue.meta.image })
    }

    return {
      title: vue.meta.title,
      meta
    }
  }
}
