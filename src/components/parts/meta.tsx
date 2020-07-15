import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from "./meta.module.css"

type Props = {
  date?: string
  tags?: string[]
}

const MetaComponent: React.FC<Props> = props => {
  let { date, tags } = props

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
              <FontAwesomeIcon
                icon={["fas", "tag"]}
                className={styles.tags__icon}
              />
              {tag}
            </li>
          ))}
        </ul>
      ) : (
        ""
      )}
    </div>
  )
}

MetaComponent.propTypes = {
  date: PropTypes.string,
  tags: PropTypes.array,
}

export default MetaComponent
