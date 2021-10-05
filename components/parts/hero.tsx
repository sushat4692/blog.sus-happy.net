import React, { useCallback } from "react"
import Image from "next/image"
import PropTypes from "prop-types"

import styles from "../../styles/components/parts/hero.module.css"

type Props = {
  isLarge?: boolean
  title?: React.ReactNode
  subTitle?: React.ReactNode
  body?: React.ReactNode
  background?: string
}

const HeroComponent: React.FC<Props> = ({
  title,
  subTitle,
  body,
  background,
  isLarge,
}) => {
  const wrapAttribute = useCallback(() => {
    return {
      "data-large": isLarge ? "" : null,
    }
  }, [isLarge])

  return (
    <div className={styles.wrap} {...wrapAttribute()}>
      <div className={styles.figure}>
        <Image
          src={background ?? "/content/background.jpg"}
          className={styles.image}
          layout="fill"
          loading="lazy"
          alt={title ? title.toString() : ""}
        />
      </div>

      <div className={`l-container ${styles.inner}`}>
        {title ? <h1 className={styles.title}>{title}</h1> : ""}
        {subTitle ? <h2 className={styles.sub_title}>{subTitle}</h2> : ""}
        {body ? body : ""}
      </div>
    </div>
  )
}

HeroComponent.defaultProps = {
  isLarge: false,
  background: "/content/background.jpg",
}

HeroComponent.propTypes = {
  isLarge: PropTypes.bool,
  title: PropTypes.node,
  subTitle: PropTypes.node,
  body: PropTypes.node,
  background: PropTypes.string,
}

export default HeroComponent
