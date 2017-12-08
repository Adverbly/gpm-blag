import React from 'react'
import '../assets/scss/main.scss'
import Header from '../components/Header'
import Footer from '../components/Footer'

class Template extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isMenuVisible: false,
            loading: 'is-loading'
        }
        this.handleToggleMenu = this.handleToggleMenu.bind(this)
    }

    componentDidMount () {
        this.timeoutId = setTimeout(() => {
            this.setState({loading: ''});
        }, 100);
    }

    componentWillUnmount () {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    handleToggleMenu() {
        this.setState({
            isMenuVisible: !this.state.isMenuVisible
        })
    }

    render() {
        const { children } = this.props

        return (
            <div className={`body ${this.state.loading} ${this.state.isMenuVisible ? 'is-menu-visible' : ''}`}>
                <div id="wrapper">
                    <Header onToggleMenu={this.handleToggleMenu} data={this.props.data}/>
                    {children()}
                    <Footer data={this.props.data} />
                </div>
            </div>
        )
    }
}

Template.propTypes = {
    children: React.PropTypes.func
}

export default Template

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
        siteTwitterUrl
        siteLinkedInUrl
        siteGithubUrl
        siteEmailUrl
      }
    }
  }`
