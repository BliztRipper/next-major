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

  render() {
    return (
      <div className="react-tabs__isFooter">
        <div className="react-tabs">
          <Link prefetch href="MyTickets">
            {this.renderFloatButton()}
          </Link>
          <ul className="react-tabs__tab-list" role="tablist">
            <div className="react-tabs__tabs-container">
              <li className="react-tabs__tab" role="tab" id="react-tabs-0" aria-selected="false" aria-disabled="false"
                aria-controls="react-tabs-1">
                <Link prefetch href="/AllMovie" >
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <div className="sprite-tab-menu1"></div>
                    <span className="tab-menu-title">ภาพยนต์</span>
                  </div>
                </Link>
              </li>
              <li className="react-tabs__tab react-tabs__tab--selected" role="tab" id="react-tabs-2" aria-selected="true"
                aria-disabled="false" aria-controls="react-tabs-3" tabindex="0">
                <Link prefetch href="/">
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <div className="sprite-tab-menu2"></div>
                    <span className="tab-menu-title">โรงภาพยนต์</span>
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
