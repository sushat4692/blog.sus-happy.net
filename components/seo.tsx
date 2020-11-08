import React from "react"
import PropTypes from "prop-types"
import Head from "next/head"

const SEO = ({ title, description, type }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content="summary" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Head>
  )
}

SEO.defaultProps = {
  title: ``,
  description: ``,
  type: `website`,
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  type: PropTypes.string,
}

export default SEO
