import React, { useContext } from "react"
import Link from "next/link"
import { Router } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from "../styles/components/header.module.css"
import SiteContext from "../context/SiteContext"

type Props = {
  router: Router
}

const HeaderComponent: React.FC<Props> = ({ router }) => {
  const { isShowNav, toggleNav } = useContext(SiteContext)
  const buttonAttribute = {
    "data-show": "",
    "data-active": isShowNav ? "" : null,
  }

  const homeAttribute = {
    "data-show": router.pathname !== "/" ? "" : null,
  }

  return (
    <div className={`${styles.wrapper}`}>
      <button
        className={`${styles.button} ${styles.button__trigger}`}
        onClick={toggleNav}
        {...buttonAttribute}
      ></button>
      <Link href={`/`}>
        <a className={`${styles.button}`} {...homeAttribute}>
          <FontAwesomeIcon icon="mountain"></FontAwesomeIcon>
        </a>
      </Link>
    </div>
  )
}

export default HeaderComponent
