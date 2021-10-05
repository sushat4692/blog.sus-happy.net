import React from "react"
import PropTypes from "prop-types"
import Head from "next/head"

const baseUrl = {
  production: process.env.NEXT_PUBLIC_SITE_URL,
  development: "http://localhost:3000",
}[process.env.NODE_ENV]

const SEO = ({ title, description, type, index, ogimage }) => {
  return (
    <Head>
      <title>{title}</title>
      {description ? (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="twitter:description" content={description} />
        </>
      ) : (
        ""
      )}
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content="summary" />
      <meta property="twitter:title" content={title} />
      <meta property="og:image" content={`${baseUrl}${ogimage}`} />

      {!index ? <meta name="robots" content="noindex" /> : ""}
    </Head>
  )
}

SEO.defaultProps = {
  title: ``,
  description: ``,
  type: `website`,
  index: true,
  ogimage: `/api/ogp.jpg`,
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  type: PropTypes.string,
  index: PropTypes.bool,
  ogimage: PropTypes.string,
}

export default SEO
