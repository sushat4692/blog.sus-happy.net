import React from "react"
import { Link, graphql, PageProps } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PartHero from "../components/parts/hero"
import PartSocial from "../components/parts/social"
import PartArticle from "../components/parts/article"

import styles from "./index.module.css"

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

const BlogIndex: React.FC<PageProps<DataProps>> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  const heroTitle = `SUSH-i BLOG`
  const heroSubTitle = (
    <>
      名古屋のWeb制作会社につとめる
      <br />
      プログラマーのつぶやき
    </>
  )
  const heroBody = <PartSocial isWhite={true} />

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />

      <PartHero
        isLarge={true}
        title={heroTitle}
        subTitle={heroSubTitle}
        body={heroBody}
      />

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
          <p className={styles.nav__item} data-prev></p>
          <p className={styles.nav__item} data-next>
            <Link to={`/page/2`} className="c-button" data-primary>
              NEXT
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 20
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
