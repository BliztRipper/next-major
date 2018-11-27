import React, { Component } from 'react'
import Link from 'next/link'

export default class GlobalFooterNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMyTicketsTotal:null
    }
  }

  componentDidMount() {
    let instantTickets =  JSON.parse(sessionStorage.getItem('dataMyTickets'))
    this.setState({
      dataMyTicketsTotal: instantTickets ? instantTickets.length : null
    })
  }


  renderFloatButton () {
    return (
      <a className="indexTab__floatButton">
        <div className="indexTab__floatButtonInner">
          <img className="indexTab__floatButton-icon" src="../static/icon-ticket.svg" alt=""/>
          { this.renderFloatButtonBadge() }
        </div>
      </a>
    )
  }

  renderFloatButtonBadge () {
    if (this.state.dataMyTicketsTotal) return <div className="indexTab__floatButton-badge">{this.state.dataMyTicketsTotal}</div>
    return false
  }

  backToHome(n){
    sessionStorage.setItem('btnNavNumber', n)
  }

  render() {
    return (
      <div className="react-tabs__isFooter">
        <div className="react-tabs">
          <Link prefetch href="/MyTickets">
            {this.renderFloatButton()}
          </Link>
          <ul className="react-tabs__tab-list" role="tablist">
            <div className="react-tabs__tabs-container">
              <li onClick={this.backToHome.bind(this,1)} className="react-tabs__tab react-tabs__tab--selected" role="tab" id="react-tabs-0" aria-selected="false" aria-disabled="false"
                aria-controls="react-tabs-1">
                <Link prefetch href="/" >
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <div className="tab-menu-icon">
                      <svg width='25' height='22' viewBox='0 0 25 22' xmlns='http://www.w3.org/2000/svg'>
                        <g id='iconGlobalNavMovie' fill='none' fillRule='evenodd'>
                          <g transform='translate(-12 -403)' stroke='#989FAE' strokeWidth='1.5'>
                            <g id='icon-movie' transform='translate(13 404)'>
                              <rect id='Rectangle-3' x='5' width='13' height='10' />
                              <rect id='Rectangle-3-Copy' x='5' y='10' width='13' height='10' />
                              <polygon id='Rectangle-3-Copy-3' points='0 5 5 5 5 10 0 10' />
                              <path d='M1.5,0 L5,0 L5,5 L0,5 L0,1.5 C-1.01453063e-16,0.671572875 0.671572875,1.52179594e-16 1.5,0 Z'
                                id='Rectangle-3-Copy-6' />
                              <path d='M0,15 L5,15 L5,20 L1.5,20 C0.671572875,20 1.01453063e-16,19.3284271 0,18.5 L0,15 Z'
                                id='Rectangle-3-Copy-2' />
                              <polygon id='Rectangle-3-Copy-8' points='0 10 5 10 5 15 0 15' />
                              <path d='M18,0 L21.5,0 C22.3284271,-1.52179594e-16 23,0.671572875 23,1.5 L23,5 L18,5 L18,0 Z'
                                id='Rectangle-3-Copy-7' />
                              <polygon id='Rectangle-3-Copy-9' points='18 5 23 5 23 10 18 10' />
                              <path d='M18,15 L23,15 L23,18.5 C23,19.3284271 22.3284271,20 21.5,20 L18,20 L18,15 Z'
                                id='Rectangle-3-Copy-4' />
                              <polygon id='Rectangle-3-Copy-9' points='18 10 23 10 23 15 18 15' />
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span className="tab-menu-title">ภาพยนตร์</span>
                  </div>
                </Link>
              </li>
              <li onClick={this.backToHome.bind(this,2)} className="react-tabs__tab" role="tab" id="react-tabs-2" aria-selected="true"
                aria-disabled="false" aria-controls="react-tabs-3" tabIndex="0">
                <Link prefetch href="/">
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <div className="tab-menu-icon">
                      <svg width='17' height='22' viewBox='0 0 17 22' xmlns='http://www.w3.org/2000/svg'>
                        <g id='iconGlobalNavLocation' fill='none' fillRule='evenodd'>
                          <g transform='translate(-44 -403)' fillRule='nonzero'
                            stroke='#989FAE' strokeWidth='1.5'>
                            <g id='icon-location' transform='translate(45 404)'>
                              <g id='Group'>
                                <path d='M7.38431792,0.125470669 C3.61576946,0.125470669 0.483800139,3.1116726 0.229168487,6.90088681 C0.127315826,8.58219378 0.662042296,10.313689 1.7569584,11.7440546 L7.1042231,19.2722948 C7.1806126,19.3726713 7.28246526,19.4228596 7.40978108,19.4228596 C7.53709691,19.4228596 7.66441273,19.3726713 7.71533906,19.2722948 L13.0371406,11.7440546 C14.1320567,10.2885949 14.6667832,8.58219378 14.5649305,6.87579268 C14.2848357,3.1116726 11.1528664,0.125470669 7.38431792,0.125470669 Z'
                                  id='Shape' />
                                <path d='M7.38431792,4.46675583 C5.80560167,4.46675583 4.50698025,5.74655665 4.50698025,7.32748708 C4.50698025,8.90841752 5.80560167,10.1882183 7.38431792,10.1882183 C8.96303416,10.1882183 10.2616556,8.90841752 10.2616556,7.32748708 C10.2616556,5.74655665 8.96303416,4.46675583 7.38431792,4.46675583 Z'
                                  id='Shape' />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span className="tab-menu-title">โรงภาพยนตร์</span>
                  </div>
                </Link>
              </li>
              <li className="isBlank">ตั้วหนัง</li>
            </div>
          </ul>
        </div>
      </div>
    )
  }
}
