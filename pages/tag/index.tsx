import { GetStaticProps, NextPage } from "next"
import Link from "next/link"

// Components
import SEO from "../../components/seo"
import PartHero from "../../components/parts/hero"

// Utility
import { getTagLists } from "../../lib/blog"

// Style
import styles from "../../styles/pages/tag.module.css"

type Props = {
  tags: string[]
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const tags = getTagLists()

  return {
    props: {
      tags,
    },
  }
}

const TagIndex: NextPage<Props> = ({ tags }) => {
  return (
    <>
      <SEO
        title={`Tag List | ${process.env.NEXT_PUBLIC_SITE_NAME}`}
        description={`Tag list of ${process.env.NEXT_PUBLIC_SITE_NAME}`}
        type="website"
      />

      <PartHero title={`Tag List`} />

      <div className="l-container">
        <div className={styles.tags}>
          {tags.map(tag => {
            return (
              <Link
                href={{
                  pathname: "/tag/[slug]",
                  query: { slug: encodeURIComponent(tag) },
                }}
                key={tag}
              >
                <a
                  className={`${styles.tags__anchor} c-button`}
                  data-primary-outline
                >
                  {tag}
                </a>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default TagIndex
