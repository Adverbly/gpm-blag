module.exports = {
  siteMetadata: {
    title: "Blog by George Montgomery",
    author: "George Montgomery",
    description: "Philosophy of Design.",
    siteTwitterUrl: "https://twitter.com/Adverbly_",
    siteLinkedInUrl: "https://www.linkedin.com/in/montgomerygeorge",
    siteGithubUrl: "https://github.com/Adverbly/Adverbly.github.io",
    siteEmailUrl: "mailto:george.p.montgomery@gmail.com",
  },
  pathPrefix: '/',
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/posts`,
        name: "posts",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          "gatsby-remark-copy-linked-files",
        ],
      },
    },
    {
        resolve: `gatsby-plugin-google-analytics`,
        options: {
            trackingId: "UA-123796728-1",
        },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`
  ],
}
