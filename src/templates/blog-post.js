import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    return (
      <div style={{margin: `0 auto`, maxWidth: 650, padding: `0 1rem`}}>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`}/>

        <header className="major">
          <h1>{post.frontmatter.title}</h1>
        </header>
        <p>
          <em>{post.frontmatter.date} </em>
        </p>
        <div dangerouslySetInnerHTML={{__html: post.html}}/>
        <hr/>
      </div>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
