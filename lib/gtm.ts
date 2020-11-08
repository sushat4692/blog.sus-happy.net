export const GTMPageView = (url: string) => {
  type PageEventProps = {
    event: string
    page: string
  }

  const pageEvent: PageEventProps = {
    event: "pageview",
    page: url,
  }
  console.log(pageEvent)

  //@ts-ignore
  window && window.dataLayer && window.dataLayer.push(pageEvent)
  return pageEvent
}
