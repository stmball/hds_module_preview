import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const Modules = ({ posts, optional }) => {
  console.log(posts)
  return (
    <ol className="module-grid">
      {posts
        .filter(post => {
          return post.frontmatter.optional === optional
        })
        .sort((post, other) => post.frontmatter.code > other.frontmatter.code)
        .map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const code = post.frontmatter.code || ""

          return (
            <li key={post.fields.slug} className="module-card">
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{code} - {title}</span>
                    </Link>
                  </h2>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
    </ol>
  )
}

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <h2>Compulsory Modules</h2>
      <Modules posts={posts} optional={false} />
      <h2>Optional Modules</h2>
      <Modules posts={posts} optional={true} />
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          code
          optional
        }
      }
    }
  }
`
