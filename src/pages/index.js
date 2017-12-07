import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import Banner from '../components/Banner'

import pic01 from '../assets/images/pic01.jpg'
import picPi1 from '../assets/images/giphy.gif'
import picAkrasia from '../assets/images/picAkrasia.jpg'
import picNumPat from '../assets/images/picNumPat.jpg'
import picDesign from '../assets/images/picDesign.jpg'
import picCommutativity from '../assets/images/picCommutativity.jpg'
let pictureMap = {
  "Pi Day 2017": picPi1,
  "Akrasia": picAkrasia,
  "A Numerical Pattern?": picNumPat,
  "Design and Intelligence": picDesign,
}
class HomeIndex extends React.Component {
    render() {
        const siteTitle = this.props.data.site.siteMetadata.title
        const siteDescription = this.props.data.site.siteMetadata.description
        let markdowns = this.props.data.allMarkdownRemark.edges


        return (
            <div>
                <Helmet>
                    <title>{siteTitle}</title>
                    <meta name="description" content={siteDescription} />
                </Helmet>

                <Banner data={this.props.data}/>

                <div id="main">
                  {markdowns.map(edge => edge.node.frontmatter.title).toString()}
                    <section id="one" className="tiles">
                      <article style={{backgroundImage: `url(${picCommutativity})`}}>
                        <header className="major">
                          <h3>Commutativity and Associativity Visualized</h3>
                          <p>Have you ever had one of those moments where you find yourself googling the definition of something for
                            the hundredth time...</p>
                        </header>
                        <Link to="/posts/akrasia/" className="link primary"></Link>
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
                    {/*<section id="two">*/}
                        {/*<div className="inner">*/}
                            {/*<header className="major">*/}
                                {/*<h2>Massa libero</h2>*/}
                            {/*</header>*/}
                            {/*<p>Nullam et orci eu lorem consequat tincidunt vivamus et sagittis libero. Mauris aliquet magna magna sed nunc rhoncus pharetra. Pellentesque condimentum sem. In efficitur ligula tate urna. Maecenas laoreet massa vel lacinia pellentesque lorem ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et sagittis libero. Mauris aliquet magna magna sed nunc rhoncus amet pharetra et feugiat tempus.</p>*/}
                            {/*<ul className="actions">*/}
                                {/*<li><Link to="/landing" className="button next">Get Started</Link></li>*/}
                            {/*</ul>*/}
                        {/*</div>*/}
                    {/*</section>*/}
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