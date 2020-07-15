import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from "./social.module.css"

type Props = {
  isWhite?: boolean
}

const SocialComponent: React.FC<Props> = props => {
  const wrapAttr = {
    "data-white": props.isWhite ? "" : null,
  }

  return (
    <div className={styles.wrap} {...wrapAttr}>
      <a
        href="https://twitter.com/sushat4692"
        target="_blank"
        rel="noreferrer"
        className={styles.item}
      >
        <FontAwesomeIcon icon={["fab", "twitter"]}></FontAwesomeIcon>
      </a>
      <a
        href="https://www.facebook.com/sushat4692"
        target="_blank"
        rel="noreferrer"
        className={styles.item}
      >
        <FontAwesomeIcon icon={["fab", "facebook-f"]}></FontAwesomeIcon>
      </a>
      <a
        href="https://github.com/sushat4692"
        target="_blank"
        rel="noreferrer"
        className={styles.item}
      >
        <FontAwesomeIcon icon={["fab", "github-alt"]}></FontAwesomeIcon>
      </a>
      <a
        href="https://sus-happy.net"
        target="_blank"
        rel="noreferrer"
        className={styles.item}
      >
        <FontAwesomeIcon icon={["fas", "link"]}></FontAwesomeIcon>
      </a>
    </div>
  )
}

SocialComponent.defaultProps = {
  isWhite: false,
}

SocialComponent.propTypes = {
  isWhite: PropTypes.bool,
}

export default SocialComponent
