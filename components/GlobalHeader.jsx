import { Component } from 'react'
import GlobalHeaderButtonBack from '../components/GlobalHeaderButtonBack'
class GlobalHeader extends Component {
  render () {
    return (
      <div className="globalHeader">
        {(() => {
          if (!this.props.hideBtnBack) {
            return <GlobalHeaderButtonBack></GlobalHeaderButtonBack>
          }
        })()}
        <div className="globalHeader__title">{this.props.children}</div>
      </div>
    )
  }
}
export default GlobalHeader