import React, { useContext } from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { WindowLocation } from "@reach/router"

import styles from "./header.module.css"
import SiteContext from "../context/SiteContext"

type Props = {
  location: WindowLocation
}

const HeaderComponent: React.FC<Props> = props => {
  const { isShowNav, toggleNav } = useContext(SiteContext)
  const buttonAttribute = {
    "data-show": "",
    "data-active": isShowNav ? "" : null,
  }

  const homeAttribute = {
    "data-show": props.location.pathname !== "/" ? "" : null,
  }

  return (
    <div className={`${styles.wrapper}`}>
      <button
        className={`${styles.button} ${styles.button__trigger}`}
        onClick={toggleNav}
        {...buttonAttribute}
      ></button>
      <Link to={`/`} className={`${styles.button}`} {...homeAttribute}>
        <FontAwesomeIcon icon="mountain"></FontAwesomeIcon>
      </Link>
    </div>
  )
}

export default HeaderComponent
