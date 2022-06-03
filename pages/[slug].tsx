import { useContext, useEffect } from "react"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Context
import SiteContext from "../context/SiteContext"

// Library
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import remarkShiki from "@stefanprobst/remark-shiki"
import remarkSlug from "remark-slug"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeStringify from "rehype-stringify"
import striptags from "striptags"
import { JSDOM } from "jsdom"
import * as shiki from "shiki"

// Utility
import {
  getPostBySlug,
  getAllPosts,
  getNextPrevPosts,
  BlogContent,
  HeaderContent,
} from "../lib/blog"

// Components
import SEO from "../components/seo"
import PartsHero from "../components/parts/hero"
import PartsMeta from "../components/parts/meta"

// Style
import styles from "../styles/pages/slug.module.css"

type Props = BlogContent & {
  headers: HeaderContent
  excerpt: string
  prev: BlogContent
  next: BlogContent
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug
  const post = getPostBySlug(slug)

  const highlighter = await shiki.getHighlighter({ theme: "github-dark" })

  // Parsing Markdown
  const markdown = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkShiki, { highlighter })
    .use(remarkSlug)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(post.content || "")
  const content = markdown.toString()
  const excerpt = striptags(content).replace(/\r?\n/g, " ").slice(0, 200)

  // Make Table Of Contents
  const dom = new JSDOM(content)
  const headerDoms = dom.window.document.querySelectorAll("h2,h3,h4,h5")
  const headers = Array.from(headerDoms).map(header => {
    return {
      level: parseInt(header.tagName.replace(/^H/i, "")),
      id: header.id,
      label: header.textContent,
    }
  })

  // Get Prev/Next page
  const { prev, next } = getNextPrevPosts(slug)

  return {
    props: {
      ...post,
      content,
      headers,
      excerpt,
      prev,
      next,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts()

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}

const DetailPage: NextPage<Props> = ({
  slug,
  frontmatter,
  excerpt,
  content,
  headers,
  next,
  prev,
}) => {
  const { setToc, clearToc } = useContext(SiteContext)

  useEffect(() => {
    setToc(headers)

    return function cleanup() {
      clearToc()
    }
  })

  return (
    <>
      <SEO
        title={`${frontmatter.title} - ${process.env.NEXT_PUBLIC_SITE_NAME}`}
        description={excerpt}
        type="article"
        ogimage={`/api/${slug}/ogp.jpg`}
      ></SEO>

      <PartsHero background={frontmatter.thumbnail} isLarge={true}></PartsHero>

      <div className="l-container">
        <article className={styles.main}>
          <header>
            <h1 className={styles.title}>{frontmatter.title}</h1>
            <PartsMeta
              date={frontmatter.date}
              tags={frontmatter.tags}
              tagLink={true}
            ></PartsMeta>
          </header>

          <section
            dangerouslySetInnerHTML={{ __html: content }}
            className={styles.content}
          ></section>

          <nav>
            <ul className={styles.navigation}>
              <li className={styles.navigation__item} data-prev>
                {prev && (
                  <Link
                    href={{ pathname: "[slug]", query: { slug: prev.slug } }}
                  >
                    <a
                      rel="prev"
                      className={styles.navigation__anchor}
                      data-prev
                    >
                      <FontAwesomeIcon
                        icon={["fas", "angle-left"]}
                        className={styles.navigation__icon}
                      />
                      {prev.frontmatter.title}
                    </a>
                  </Link>
                )}
              </li>
              <li className={styles.navigation__item} data-next>
                {next && (
                  <Link
                    href={{ pathname: "[slug]", query: { slug: next.slug } }}
                  >
                    <a
                      rel="next"
                      className={styles.navigation__anchor}
                      data-next
                    >
                      <FontAwesomeIcon
                        icon={["fas", "angle-right"]}
                        className={styles.navigation__icon}
                      />
                      {next.frontmatter.title}
                    </a>
                  </Link>
                )}
              </li>
            </ul>
            <div className={styles.navigation}>
              <p className={styles.navigation__item} data-home>
                <Link href={`/`}>
                  <a className="c-button" data-primary>
                    HOME
                  </a>
                </Link>
              </p>
            </div>
          </nav>
        </article>
      </div>
    </>
  )
}

export default DetailPage
