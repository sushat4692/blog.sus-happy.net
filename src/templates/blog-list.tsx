import React from "react"
import { Link, graphql, PageProps } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PartHero from "../components/parts/hero"
import PartArticle from "../components/parts/article"

import styles from "../pages/index.module.css"

type DataProps = {
  site: {
    siteMetadata: {
      title: string
    }
    buildTime: string
  }
  allMarkdownRemark: {
    edges: {
      node: {
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
    }[]
  }
}

type ContextProps = {
  limit: number
  skip: number
  numPages: number
  currentPage: number
}

const BlogIndex: React.FC<PageProps<DataProps, ContextProps>> = ({
  data,
  pageContext,
  location,
}) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  const { numPages, currentPage } = pageContext

  const prevTo = currentPage > 2 ? `/page/${currentPage - 1}` : `/`
  const nextTo = currentPage < numPages ? `/page/${currentPage + 1}` : null

  const heroTitle = `SUSH-i BLOG`

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />

      <PartHero title={heroTitle} />

      <div className="l-container">
        <div className={styles.wrap}>
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <PartArticle
                key={node.fields.slug}
                slug={node.fields.slug}
                title={title}
                thumbnail={node.frontmatter.thumbnail}
                date={node.frontmatter.date}
                tags={node.frontmatter.tags}
              />
            )
          })}
        </div>

        <div className={styles.nav}>
          <p className={styles.nav__item} data-prev>
            <Link to={prevTo} className="c-button" data-primary>
              PREV
            </Link>
          </p>
          <p className={styles.nav__item} data-next>
            {nextTo ? (
              <Link to={nextTo} className="c-button" data-primary>
                NEXT
              </Link>
            ) : (
              ""
            )}
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            thumbnail
            tags
          }
        }
      }
    }
  }
`
