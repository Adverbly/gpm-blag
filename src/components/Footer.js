import React from 'react'

const Footer = (props) => (
    <footer id="footer">
        <div className="inner">
            <ul className="icons">
                <li><a href={props.data.site.siteMetadata.siteTwitterUrl} className="icon alt fa-twitter"><span className="label">Twitter</span></a></li>
                <li><a href={props.data.site.siteMetadata.siteEmailUrl} className="icon alt fa-envelope"><span className="label">Email</span></a></li>
                <li><a href={props.data.site.siteMetadata.siteGithubUrl} className="icon alt fa-github"><span className="label">GitHub</span></a></li>
                <li><a href={props.data.site.siteMetadata.siteLinkedInUrl} className="icon alt fa-linkedin"><span className="label">LinkedIn</span></a></li>
            </ul>
            <ul className="copyright">
                <li>&copy; Untitled</li><li>Design: <a href="https://html5up.net">HTML5 UP</a></li>
            </ul>
        </div>
    </footer>
)

export default Footer
