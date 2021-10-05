import { GetStaticProps, GetStaticPaths, NextPage } from "next"
import { useCallback } from "react"
import { ParsedUrlQuery } from "querystring"
import Link from "next/link"

// Components
import SEO from "../../components/seo"
import PartHero from "../../components/parts/hero"
import PartArticle from "../../components/parts/article"

// Utility
import { getAllPosts, BlogContent, PER_PAGE } from "../../lib/blog"

// Style
import styles from "../../styles/pages/index.module.css"

type Props = {
  p: number
  posts: BlogContent[]
  hasNext: boolean
  hasPrev: boolean
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const p = params.p ? parseInt(params.p as string) : 1

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

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts()
  const maxPage = Math.ceil(posts.length / PER_PAGE)

  const paths: { params: ParsedUrlQuery }[] = []
  for (let i = 2; i <= maxPage; i += 1) {
    paths.push({ params: { p: i.toString() } })
  }

  return {
    paths,
    fallback: false,
  }
}

const Page: NextPage<Props> = ({ p, posts, hasPrev, hasNext }) => {
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
        title={`Page ${p} | ${process.env.NEXT_PUBLIC_SITE_NAME}`}
        type="website"
        index={false}
      />

      <PartHero title={`Page ${p}`} />

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
              <Link href={prevLink()}>
                <a className="c-button" data-primary>
                  PREV
                </a>
              </Link>
            )}
          </p>
          <p className={styles.nav__item} data-next>
            {hasNext && (
              <Link href={nextLink()}>
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

export default Page
