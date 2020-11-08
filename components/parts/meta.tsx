import React from "react"
import Link from "next/link"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from "../../styles/components/parts/meta.module.css"

type Props = {
  date?: string
  tags?: string[]
  tagLink?: boolean
}

const MetaComponent: React.FC<Props> = props => {
  let { date, tags, tagLink } = props

  return (
    <div className={styles.wrap}>
      <time className={styles.time}>
        <FontAwesomeIcon
          icon={["far", "clock"]}
          className={styles.time__icon}
        />
        {date}
      </time>

      {tags ? (
        <ul className={styles.tags}>
          {tags.map(tag => (
            <li className={styles.tags__item} key={tag}>
              {tagLink && (
                <Link href={{ pathname: "/tag/[slug]", query: { slug: tag } }}>
                  <a className={styles.tags__anchor}>
                    <FontAwesomeIcon
                      icon={["fas", "tag"]}
                      className={styles.tags__icon}
                    />
                    {tag}
                  </a>
                </Link>
              )}
              {!tagLink && (
                <>
                  <FontAwesomeIcon
                    icon={["fas", "tag"]}
                    className={styles.tags__icon}
                  />
                  {tag}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        ""
      )}
    </div>
  )
}

MetaComponent.defaultProps = {
  tagLink: false,
}

MetaComponent.propTypes = {
  date: PropTypes.string,
  tags: PropTypes.array,
  tagLink: PropTypes.bool,
}

export default MetaComponent
