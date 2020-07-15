import React, { useContext } from "react"
import PropTypes from "prop-types"
import { toUrl } from "gatsby-source-gravatar"

import styles from "./side.module.css"
import SiteContext from "../context/SiteContext"

import PartsSocial from "./parts/social"

type Props = {
  toc?: string
}

const SideComponent: React.FC<Props> = props => {
  const { isShowNav } = useContext(SiteContext)
  const imageSource = toUrl("sush@sus-happy.net", "size=480")

  const wrapAttribute = {
    "data-show": isShowNav ? "" : null,
  }

  const { toc } = props

  return (
    <aside className={styles.wrap} {...wrapAttribute}>
      <div className={styles.avatar}>
        <figure className={styles.avatar__figure}>
          <img
            src={imageSource}
            alt="SUSH"
            className={styles.avatar__figure__img}
          />
          <figcaption className={styles.avatar__figure__caption}>
            SUSH
          </figcaption>
        </figure>

        <PartsSocial></PartsSocial>
      </div>

      {/* {toc ? (
        <div
          className={styles.toc}
          dangerouslySetInnerHTML={{ __html: toc }}
        ></div>
      ) : (
        ""
      )} */}
    </aside>
  )
}

SideComponent.propTypes = {
  toc: PropTypes.string,
}

export default SideComponent
