import React, { useCallback, useContext } from "react"
import Link from "next/link"
import { Router } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMountain } from "@fortawesome/free-solid-svg-icons"

import styles from "../styles/components/header.module.css"
import SiteContext from "../context/SiteContext"

type Props = {
  router: Router
}

const HeaderComponent: React.FC<Props> = ({ router }) => {
  const { isShowNav, toggleNav } = useContext(SiteContext)
  const buttonAttribute = useCallback(() => {
    return {
      "data-show": "",
      "data-active": isShowNav ? "" : null,
    }
  }, [isShowNav])

  const homeAttribute = useCallback(() => {
    return {
      "data-show": router.pathname !== "/" ? "" : null,
    }
  }, [router])

  return (
    <div className={`${styles.wrapper}`}>
      <button
        aria-label="Sidebar Toggle Button"
        className={`${styles.button} ${styles.button__trigger}`}
        onClick={toggleNav}
        {...buttonAttribute()}
      ></button>
      <Link href={`/`} passHref>
        <a className={`${styles.button}`} {...homeAttribute()}>
          <FontAwesomeIcon
            icon={faMountain}
            title="Blog Home"
          ></FontAwesomeIcon>
        </a>
      </Link>
    </div>
  )
}

export default HeaderComponent
