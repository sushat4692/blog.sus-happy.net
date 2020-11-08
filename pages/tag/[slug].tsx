import { GetStaticProps, GetStaticPaths, NextPage } from "next"
import Link from "next/link"

// Components
import SEO from "../../components/seo"
import PartHero from "../../components/parts/hero"
import PartArticle from "../../components/parts/article"

// Utility
import { getTagPosts, getTagLists, BlogContent, PER_PAGE } from "../../lib/blog"

// Style
import styles from "../../styles/pages/index.module.css"

type Props = {
  p: number
  tag: string
  posts: BlogContent[]
  hasNext: boolean
  hasPrev: boolean
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const p = 1
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

  return {
    paths: tags.map(tag => {
      return {
        params: {
          slug: encodeURIComponent(tag),
        },
      }
    }),
    fallback: false,
  }
}

const Page: NextPage<Props> = ({ p, tag, posts, hasPrev, hasNext }) => {
  const prevLink = (() => {
    if (p <= 2) {
      return { pathname: "/tag/[slug]/", query: { slug: tag } }
    } else {
      return {
        pathname: "/tag/[slug]/page/[p]",
        query: { slug: tag, p: p - 1 },
      }
    }
  })()
  const nextLink = {
    pathname: "/tag/[slug]/page/[p]",
    query: { slug: tag, p: p + 1 },
  }

  return (
    <>
      <SEO
        title={`${tag} | SUSH-i BLOG`}
        description="Tweet by who's working as web programmer at the company in Nagoya, Japan/Makati, Philippines"
        type="website"
      />

      <PartHero title={`${tag}`} />

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

export default Page
