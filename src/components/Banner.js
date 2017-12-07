import React from 'react'

class Banner extends React.Component {
  render(props) {
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = this.props.data.site.siteMetadata.description

    return (
    <section id="banner" className="major">
        <div className="inner">
            <header className="major">
                <h1>{siteTitle}</h1>
            </header>
            <div className="content">
                <p>{siteDescription}</p>
                <ul className="actions">
                    <li><a href="#one" className="button next scrolly">Get Started</a></li>
                </ul>
            </div>
        </div>
    </section>
    )
  }
}

export default Banner