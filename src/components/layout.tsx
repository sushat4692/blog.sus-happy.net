import React, { useState } from "react"
import PropTypes from "prop-types"
import { WindowLocation } from "@reach/router"

// Context
import SiteContext from "../context/SiteContext"

import Header from "./header"
import Side from "./side"

type Props = {
  location?: WindowLocation
  title?: string
  toc?: string
}

const Layout: React.FC<Props> = ({ location, title, toc, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  const [isShowNav, setIsShowNav] = useState(false)
  const toggleNav = () => {
    setIsShowNav(!isShowNav)
  }

  const mainAttr = {
    "data-avoid": isShowNav ? "" : null,
  }

  return (
    <SiteContext.Provider value={{ isShowNav, toggleNav }}>
      <div className={`l-wrapper`}>
        <Header location={location} />

        <main className={`l-wrapper__main`} {...mainAttr}>
          {children}
        </main>

        <Side toc={toc} />
      </div>
    </SiteContext.Provider>
  )
}

export default Layout
