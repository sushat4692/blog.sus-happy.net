import { createContext } from "react"

const SiteContext = createContext<{
  isShowNav: boolean
  toggleNav: () => void
}>({
  isShowNav: false,
  toggleNav: () => {},
})

export default SiteContext
