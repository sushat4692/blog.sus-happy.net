import { GetStaticProps, GetStaticPaths, NextPage } from "next"
import Link from "next/link"
import { useCallback } from "react"

// Components
import SEO from "../../../../components/seo"
import PartHero from "../../../../components/parts/hero"
import PartArticle from "../../../../components/parts/article"

// Utility
import {
  getTagPosts,
  getTagLists,
  BlogContent,
  PER_PAGE,
} from "../../../../lib/blog"

// Style
import styles from "../../../../styles/pages/index.module.css"

type Props = {
  p: number
  tag: string
  posts: BlogContent[]
  hasNext: boolean
  hasPrev: boolean
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const p = params.p ? parseInt(params.p as string) : 1
  const tag = Array.isArray(params.slug) ? params.slug.join("/") : params.slug

  const allPosts = getTagPosts(tag)
  const hasNext = allPosts.length > (p - 1) * PER_PAGE + PER_PAGE
  const hasPrev = p > 1
  const posts = allPosts.slice(
    (p - 1) * PER_PAGE,
    (p - 1) * PER_PAGE + PER_PAGE
  )

  return {
    props: {
      p,
      tag,
      posts,
      hasNext,
      hasPrev,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = getTagLists()
  const paths = []

  tags.forEach(tag => {
    const posts = getTagPosts(tag)
    const maxPage = Math.ceil(posts.length / PER_PAGE)
    for (let i = 2; i <= maxPage; i += 1) {
      paths.push({ params: { slug: encodeURIComponent(tag), p: i.toString() } })
    }
  })

  return {
    paths,
    fallback: false,
  }
}

const Page: NextPage<Props> = ({ p, tag, posts, hasPrev, hasNext }) => {
  const prevLink = useCallback(() => {
    if (p <= 2) {
      return { pathname: "/tag/[slug]/", query: { slug: tag } }
    } else {
      return {
        pathname: "/tag/[slug]/page/[p]",
        query: { slug: tag, p: p - 1 },
      }
    }
  }, [tag, p])
  const nextLink = useCallback(() => {
    return {
      pathname: "/tag/[slug]/page/[p]",
      query: { slug: tag, p: p + 1 },
    }
  }, [tag, p])

  return (
    <>
      <SEO
        title={`Page ${p} | ${decodeURIComponent(tag)} | ${
          process.env.NEXT_PUBLIC_SITE_NAME
        }`}
        type="website"
        index={false}
      />

      <PartHero title={`Page ${p} | ${decodeURIComponent(tag)}`} />

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

export default Page
