import React, { useCallback, useContext, useRef } from "react"
import Link from "next/link"
import PropTypes from "prop-types"
import MD5 from "crypto-js/md5"

import styles from "../styles/components/side.module.css"
import SiteContext from "../context/SiteContext"

import PartsSocial from "./parts/social"

const SideComponent: React.FC = () => {
  const { isShowNav, toc } = useContext(SiteContext)
  const imageSource = useRef(
    `https://www.gravatar.com/avatar/${MD5(
      "sush@sus-happy.net"
    ).toString()}?size=480`
  )

  const wrapAttribute = useCallback(() => {
    return {
      "data-show": isShowNav ? "" : null,
    }
  }, [isShowNav])

  return (
    <aside className={styles.wrap} {...wrapAttribute()}>
      <div className={styles.avatar}>
        <figure className={styles.avatar__figure}>
          <img
            src={imageSource.current}
            alt="SUSH"
            className={styles.avatar__figure__img}
          />
          <figcaption className={styles.avatar__figure__caption}>
            SUSH
          </figcaption>
        </figure>

        <PartsSocial></PartsSocial>
      </div>

      <nav className={styles.nav}>
        <h2 className={styles.nav__head}>MENU</h2>

        <ul className={styles.nav__list}>
          <li className={styles.nav__item}>
            <Link href="/">
              <a className={styles.nav__anchor}>Home</a>
            </Link>
          </li>
          <li className={styles.nav__item}>
            <Link href="/tag">
              <a className={styles.nav__anchor}>Tags</a>
            </Link>
          </li>
        </ul>
      </nav>

      {toc.length > 0 ? (
        <nav className={styles.toc}>
          <h2 className={styles.toc__head}>Table of Contents</h2>

          <ul className={styles.toc__list}>
            {toc.map(head => {
              return (
                <li className={styles.toc__item} key={head.id}>
                  <a
                    href={`#${head.id}`}
                    className={`${styles.toc__anchor}`}
                    data-level={head.level}
                  >
                    {head.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      ) : (
        ""
      )}
    </aside>
  )
}

SideComponent.propTypes = {
  toc: PropTypes.string,
}

export default SideComponent
