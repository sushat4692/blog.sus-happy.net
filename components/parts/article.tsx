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

const ArticleComponent: React.FC<Props> = ({
  slug,
  title,
  date,
  tags,
  thumbnail,
}: Props) => {
  if (!thumbnail) {
    thumbnail = "/content/noimage.png"
  }

  return (
    <Link href={{ pathname: "/[slug]", query: { slug } }} passHref>
      <a className={styles.wrap}>
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
