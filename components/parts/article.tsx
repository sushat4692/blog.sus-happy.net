import React from "react"
import Link from "next/link"
import Image from "next/image"
import PropTypes from "prop-types"

import PartsMeta from "./meta"

import styles from "../../styles/components/parts/article.module.css"

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
    <Link href={{ pathname: "/[slug]", query: { slug } }}>
      <a className={styles.wrap}>
        <div className={styles.thumb}>
          <Image
            src={thumbnail}
            layout="fill"
            alt={title}
            loading="lazy"
            className={styles.thumb__image}
          />
        </div>
        <h2 className={styles.title}>{title}</h2>
        <PartsMeta date={date} tags={tags} />
      </a>
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
