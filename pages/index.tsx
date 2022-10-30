import { GetStaticProps, NextPage } from "next"
import Link from "next/link"

// Components
import SEO from "../components/seo"
import PartHero from "../components/parts/hero"
import PartSocial from "../components/parts/social"
import PartArticle from "../components/parts/article"

// Utility
import { getAllPosts, BlogContent, PER_PAGE } from "../lib/blog"

// Style
import styles from "../styles/pages/index.module.css"
import { useCallback, useRef } from "react"

type Props = {
  p: number
  posts: BlogContent[]
  hasNext: boolean
  hasPrev: boolean
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const p = 1

  const allPosts = getAllPosts()
  const hasNext = allPosts.length > (p - 1) * PER_PAGE + PER_PAGE
  const hasPrev = p > 1
  const posts = allPosts.slice(
    (p - 1) * PER_PAGE,
    (p - 1) * PER_PAGE + PER_PAGE
  )

  return {
    props: {
      p,
      posts,
      hasNext,
      hasPrev,
    },
  }
}

const Home: NextPage<Props> = ({ p, posts, hasPrev, hasNext }) => {
  const heroSubTitle = useRef(
    <>名古屋のWeb制作会社につとめるプログラマーのつぶやき</>
  )
  const heroBody = useRef(<PartSocial isWhite={true} />)

  const prevLink = useCallback(() => {
    if (p <= 2) {
      return "/"
    } else {
      return { pathname: "/page/[p]", query: { p: p - 1 } }
    }
  }, [p])
  const nextLink = useCallback(() => {
    return { pathname: "/page/[p]", query: { p: p + 1 } }
  }, [p])

  return (
    <>
      <SEO
        title="SUSH-i LOG"
        description="名古屋のWeb制作会社につとめるプログラマーのつぶやき"
        type="website"
        index={false}
      ></SEO>

      <PartHero
        isLarge={true}
        title={process.env.NEXT_PUBLIC_SITE_NAME}
        subTitle={heroSubTitle.current}
        body={heroBody.current}
      />

      <div className="l-container">
        <div className={styles.wrap}>
          {posts.map(({ frontmatter, slug }) => {
            const title = frontmatter.title || slug
            return (
              <PartArticle
                key={slug}
                slug={slug}
                title={title}
                thumbnail={frontmatter.thumbnail}
                date={frontmatter.date}
                tags={frontmatter.tags}
              />
            )
          })}
        </div>

        <div className={styles.nav}>
          {hasPrev && (
            <p className={styles.nav__item} data-prev>
              <Link href={prevLink()} className="c-button" data-primary>
                PREV
              </Link>
            </p>
          )}
          {hasNext && (
            <p className={styles.nav__item} data-next>
              <Link href={nextLink()} className="c-button" data-primary>
                NEXT
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default Home
