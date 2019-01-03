import { Component } from 'react'
import Router from 'next/router'
class GlobalHeaderButtonBack extends Component {
  back () {
    Router.back()
  }
  render () {
    return (
      <div className="globalHeader__button" onClick={this.back.bind(this)}>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
            <defs> <path id="a" d="M9.805 10.995L14.7 6.1a.99.99 0 0 0-1.4-1.4l-6.593 6.593a1 1 0 0 0 0 1.414L13.3 19.3a.99.99 0 0 0 1.4-1.4L9.8 13l-1.007-1 1.002-.995.01-.01z"/></defs>
            <g fill="none" fillRule="evenodd">
              <mask id="b" fill="#fff"><use xlinkHref="#a" /></mask>
              <use fill="#666" xlinkHref="#a" />
              <g fill="#666" mask="url(#b)">
                <path d="M0 0h24v24H0z" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    )
  }
}
export default GlobalHeaderButtonBack