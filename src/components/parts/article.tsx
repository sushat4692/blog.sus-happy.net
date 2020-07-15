import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

import PartsMeta from "./meta"

import styles from "./article.module.css"

type Props = {
  slug?: string
  title?: string
  thumbnail?: string
  date?: string
  tags?: string[]
}

const ArticleComponent: React.FC<Props> = props => {
  const { slug, title, date, tags } = props
  let { thumbnail } = props

  if (!thumbnail) {
    thumbnail = "/content/noimage.png"
  }

  return (
    <Link to={slug} className={styles.wrap}>
      <div className={styles.thumb}>
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className={styles.thumb__image}
        />
      </div>
      <h2 className={styles.title}>{title}</h2>
      <PartsMeta date={date} tags={tags} />
    </Link>
  )
}

ArticleComponent.defaultProps = {}

ArticleComponent.propTypes = {
  slug: PropTypes.string,
  title: PropTypes.string,
  thumbnail: PropTypes.string,
  date: PropTypes.string,
  tags: PropTypes.array,
}

export default ArticleComponent
