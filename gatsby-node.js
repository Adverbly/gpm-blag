const _ = require("lodash")
const Promise = require("bluebird")
const path = require("path")
const select = require(`unist-util-select`)
const fs = require(`fs-extra`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const pages = []
    const blogPost = path.resolve("./src/templates/blog-post.js")
    resolve(
      graphql(
        `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              frontmatter {
                path
              }
            }
          }
        }
      }
    `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        _.each(result.data.allMarkdownRemark.edges, edge => {
          createPage({
            path: edge.node.frontmatter.path,
            component: blogPost,
            context: {
              path: edge.node.frontmatter.path,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators
  if (node.internal.type === `MarkdownRemark`) {
    const backgroundPicture = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `backgroundPicture`,
      value: backgroundPicture,
    })
  }
}
// // Implement the Gatsby API “onCreatePage”. This is
// // called after every page is created.
// exports.onCreatePage = async ({ page, boundActionCreators }) => {
//   const {createPage} = boundActionCreators
//
//   return new Promise((resolve, reject) => {
//     console.log(page.path)
//     if (page.path.match(/^\/posts\/pi-day-2017\//)) {
//       // It's assumed that `landingPage.js` exists in the `/layouts/` directory
//       page.layout = "postLayout"
//
//       // Update the page.
//       createPage(page)
//     }
//
//     resolve()
//   })
// }