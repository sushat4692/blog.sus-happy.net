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
  const heroTitle = `SUSH-i BLOG`
  const heroSubTitle = (
    <>
      名古屋のWeb制作会社につとめる
      <br />
      プログラマーのつぶやき
    </>
  )
  const heroBody = <PartSocial isWhite={true} />

  const prevLink = (() => {
    if (p <= 2) {
      return "/"
    } else {
      return { pathname: "/page/[p]", query: { p: p - 1 } }
    }
  })()
  const nextLink = { pathname: "/page/[p]", query: { p: p + 1 } }

  return (
    <>
      <SEO
        title="SUSH-i LOG"
        description="Tweet by who's working as web programmer at the company in Nagoya, Japan/Makati, Philippines"
        type="website"
      ></SEO>

      <PartHero
        isLarge={true}
        title={heroTitle}
        subTitle={heroSubTitle}
        body={heroBody}
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
          <p className={styles.nav__item} data-prev>
            {hasPrev && (
              <Link href={prevLink}>
                <a className="c-button" data-primary>
                  PREV
                </a>
              </Link>
            )}
          </p>
          <p className={styles.nav__item} data-next>
            {hasNext && (
              <Link href={nextLink}>
                <a className="c-button" data-primary>
                  NEXT
                </a>
              </Link>
            )}
          </p>
        </div>
      </div>
    </>
  )
}

export default Home
