import { createContext } from "react"

// Utility
import { HeaderContent } from "../lib/blog"

const SiteContext = createContext<{
  isShowNav: boolean
  toggleNav: () => void
  toc: HeaderContent
  setToc: (param: HeaderContent) => void
  clearToc: () => void
}>({
  isShowNav: false,
  toggleNav: () => {},
  toc: [],
  setToc: () => {},
  clearToc: () => {},
})

export default SiteContext
