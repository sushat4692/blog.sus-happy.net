import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTwitter, faGithubAlt } from "@fortawesome/free-brands-svg-icons"
import { faLink } from "@fortawesome/free-solid-svg-icons"

import styles from "../../styles/components/parts/social.module.css"

type Props = {
  isWhite?: boolean
}

const SocialComponent: React.FC<Props> = ({ isWhite }) => {
  const wrapAttr = useCallback(() => {
    return {
      "data-white": isWhite ? "" : null,
    }
  }, [isWhite])

  return (
    <div className={styles.wrap} {...wrapAttr()}>
      <a
        href="https://twitter.com/sushat4692"
        target="_blank"
        rel="noreferrer"
        className={styles.item}
      >
        <FontAwesomeIcon icon={faTwitter} title="Twitter"></FontAwesomeIcon>
      </a>
      <a
        href="https://github.com/sushat4692"
        target="_blank"
        rel="noreferrer"
        className={styles.item}
      >
        <FontAwesomeIcon icon={faGithubAlt} title="GitHub"></FontAwesomeIcon>
      </a>
      <a
        href="https://sus-happy.net"
        target="_blank"
        rel="noreferrer"
        className={styles.item}
      >
        <FontAwesomeIcon icon={faLink} title="WebSite"></FontAwesomeIcon>
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
