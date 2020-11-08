// Styles
import "normalize.css/normalize.css"
import "../styles/variables.css"
import "../styles/foundation.css"
import "prismjs/themes/prism-tomorrow.css"

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

import { useState } from "react"
import type { AppProps } from "next/app"

// Context
import SiteContext from "../context/SiteContext"

// Components
import Header from "../components/header"
import Side from "../components/side"

// Utility
import { HeaderContent } from "../lib/blog"

library.add(
  faTwitter,
  faFacebookF,
  faGithubAlt,
  faClock,
  faLink,
  faTag,
  faMountain,
  faAngleLeft,
  faAngleRight
)

function MyApp({ Component, pageProps, router }: AppProps) {
  const [isShowNav, setIsShowNav] = useState(false)
  const toggleNav = () => {
    setIsShowNav(!isShowNav)
  }
  const [toc, setToc] = useState<HeaderContent>([])
  const clearToc = () => {
    setToc([])
  }

  const mainAttr = {
    "data-avoid": isShowNav ? "" : null,
  }

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
