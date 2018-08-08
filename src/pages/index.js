import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import Banner from '../components/Banner'

import picPi1 from '../assets/images/looping-giphy.gif'
import picAkrasia from '../assets/images/smoking.png'
import picNumPat from '../assets/images/numerical-pattern-pic.jpg'
import picDesign from '../assets/images/design-int.png'
import picPi2 from '../assets/images/IMG_20180313_201804.jpg'
import picCommutativity from '../assets/images/assoc-pic.png'
let pictureMap = {
    "Big Counting": picNumPat,
    "Pi Day 2018": picPi2,
    "Akrasia": picAkrasia,
    "A Numerical Pattern?": picNumPat,
      "Pi Day 2017": picPi1,
      "Design and Intelligence": picDesign,
}
class HomeIndex extends React.Component {
    render() {
        const siteTitle = this.props.data.site.siteMetadata.title
        const siteDescription = this.props.data.site.siteMetadata.description
        let markdowns = this.props.data.allMarkdownRemark.edges.reverse();


        return (
            <div>
                <Helmet>
                    <title>{siteTitle}</title>
                    <meta name="description" content={siteDescription} />
                </Helmet>

                <Banner data={this.props.data}/>

                <div id="main">
                    <section id="one" className="tiles">
                      <article style={{backgroundImage: `url(${picCommutativity})`}}>
                        <header className="major">
                          <h3>Commutativity and Associativity Visualized</h3>
                          <p>Have you ever had one of those moments where you find yourself googling the definition of something for
                            the hundredth time...</p>
                        </header>
                        <Link to="/posts/2017-01-24-Associativity/" className="link primary"></Link>
                      </article>
                      {markdowns.map(({ node }) => (
                        <article style={{backgroundImage: `url(${pictureMap[node.frontmatter.title]})`}}>
                          <header className="major">
                            <h3>{node.frontmatter.title}</h3>
                            <p>{node.excerpt}</p>
                          </header>
                          <Link to={node.frontmatter.path} className="link primary"></Link>
                        </article>
                      ))}
                    </section>
                </div>

            </div>
        )
    }
}

export default HomeIndex

export const pageQuery = graphql`
    query PageQuery {
        site {
            siteMetadata {
                title
                description
            }
        }
        allSitePage(filter: {path: {regex: "/posts/.*/"}}){
          edges{
            node
            {
              path
              layout
            }
          }
        }
        allMarkdownRemark{
          edges{
            node{
              excerpt
              frontmatter {
                path
                title
              }
            }
          }
        }
    }
`