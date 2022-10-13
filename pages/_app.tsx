// Styles
import "normalize.css/normalize.css"
import "../styles/variables.css"
import "../styles/foundation.css"

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faTwitter,
  faFacebookF,
  faGithubAlt,
} from "@fortawesome/free-brands-svg-icons"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import {
  faLink,
  faTag,
  faMountain,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons"

import { useState, useEffect, useCallback } from "react"
import type { AppProps } from "next/app"
import Router from "next/router"

// Context
import SiteContext from "../context/SiteContext"

// Components
import Header from "../components/header"
import Side from "../components/side"

// Utility
import { HeaderContent } from "../lib/blog"
import { GTMPageView } from "../lib/gtm"

// library.add(
//   faTwitter,
//   faFacebookF,
//   faGithubAlt,
//   faClock,
//   faLink,
//   faTag,
//   faMountain,
//   faAngleLeft,
//   faAngleRight
// )

function MyApp({ Component, pageProps, router }: AppProps) {
  const [isShowNav, setIsShowNav] = useState(false)
  const toggleNav = useCallback(() => {
    setIsShowNav(!isShowNav)
  }, [isShowNav])
  const [toc, setToc] = useState<HeaderContent>([])
  const clearToc = useCallback(() => {
    setToc([])
  }, [])

  // Initiate GTM
  useEffect(() => {
    const handleRouteChange = (url: string) => GTMPageView(url)
    Router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange)
    }
  })

  const [mainAttr, updateMainAttr] = useState({
    "data-avoid": isShowNav ? "" : null,
  })
  useEffect(() => {
    updateMainAttr({
      "data-avoid": isShowNav ? "" : null,
    })
  }, [isShowNav])

  return (
    <SiteContext.Provider
      value={{ isShowNav, toggleNav, toc, setToc, clearToc }}
    >
      <div className={`l-wrapper`}>
        <Header router={router} />

        <main className={`l-wrapper__main`} {...mainAttr}>
          <Component {...pageProps} />
        </main>

        <Side />
      </div>
    </SiteContext.Provider>
  )
}

export default MyApp
