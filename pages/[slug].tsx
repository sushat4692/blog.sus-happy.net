import { useContext, useEffect } from "react"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Link from "next/link"

// Context
import SiteContext from "../context/SiteContext"

// Library
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeShiki from "@leafac/rehype-shiki"
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
    .use(remarkSlug)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, { highlighter })
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

      <div className="l-container">
        <article className={styles.main}>
          <header className={styles.header}>
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
                  <>
                    <span className={styles.navigation__item__label}>PREV</span>
                    <Link
                      href={{ pathname: "[slug]", query: { slug: prev.slug } }}
                      rel="prev"
                      className={styles.navigation__anchor}
                      data-prev
                    >
                      {prev.frontmatter.title}
                    </Link>
                  </>
                )}
              </li>
              <li className={styles.navigation__item} data-next>
                {next && (
                  <>
                    <span className={styles.navigation__item__label}>NEXT</span>
                    <Link
                      href={{ pathname: "[slug]", query: { slug: next.slug } }}
                      rel="next"
                      className={styles.navigation__anchor}
                      data-next
                    >
                      {next.frontmatter.title}
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </nav>
        </article>
      </div>
    </>
  )
}

export default DetailPage
