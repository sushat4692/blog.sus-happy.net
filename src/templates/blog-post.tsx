import React from "react"
import { Link, graphql, PageProps } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PartsHero from "../components/parts/hero"
import PartsMeta from "../components/parts/meta"

import styles from "./blog-post.module.css"

type DataProps = {
  site: {
    siteMetadata: {
      title: string
    }
  }
  markdownRemark: {
    id: string
    excerpt: string
    html: string
    tableOfContents: string
    frontmatter: {
      title: string
      date: string
      thumbnail?: string
      tags: string[]
    }
  }
}

type PostType = {
  excerpt: string
  fields: {
    slug: string
  }
  frontmatter: {
    title: string
    date: string
    thumbnail?: string
    tags: string[]
  }
}

type ContextProps = {
  slug: string
  previous: PostType
  next: PostType
}

const BlogPostTemplate: React.FC<PageProps<DataProps, ContextProps>> = ({
  data,
  pageContext,
  location,
}) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext

  return (
    <Layout location={location} title={siteTitle} toc={post.tableOfContents}>
      <SEO title={post.frontmatter.title} description={post.excerpt} />

      <PartsHero
        background={post.frontmatter.thumbnail}
        isLarge={true}
      ></PartsHero>

      <div className="l-container">
        <article className={styles.main}>
          <header>
            <h1 className={styles.title}>{post.frontmatter.title}</h1>
            <PartsMeta
              date={post.frontmatter.date}
              tags={post.frontmatter.tags}
            ></PartsMeta>
          </header>
          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
            className={styles.content}
          />
        </article>

        <nav>
          <ul className={styles.navigation}>
            <li className={styles.navigation__item} data-prev>
              {previous && (
                <Link
                  to={previous.fields.slug}
                  rel="prev"
                  className={styles.navigation__anchor}
                  data-prev
                >
                  <FontAwesomeIcon
                    icon={["fas", "angle-left"]}
                    className={styles.navigation__icon}
                  />
                  {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li className={styles.navigation__item} data-next>
              {next && (
                <Link
                  to={next.fields.slug}
                  rel="next"
                  className={styles.navigation__anchor}
                  data-next
                >
                  <FontAwesomeIcon
                    icon={["fas", "angle-right"]}
                    className={styles.navigation__icon}
                  />
                  {next.frontmatter.title}
                </Link>
              )}
            </li>
          </ul>
          <div className={styles.navigation}>
            <p className={styles.navigation__item} data-home>
              <Link to={`/`} className="c-button" data-primary>
                HOME
              </Link>
            </p>
          </div>
        </nav>
      </div>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      tableOfContents
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        thumbnail
        tags
      }
    }
  }
`
