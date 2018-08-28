import { PureComponent } from 'react'
import '../styles/style.scss'
import GlobalHeader from '../components/GlobalHeader'
import Layout from '../components/Layout'
import loading from '../static/loading.gif'
import empty from '../static/emptyTicket.png'
import Router from 'next/router'

class HistoryTickets extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isEmpty:true,
      error: null,
    }
  }
  handleBackButton () {
    Router.push({
      pathname: '/'
    })
  }
  goToDetailHistory () {
    Router.push({
      pathname: '/HistoryTicketDetail'
    })
  }
  renderEachList (key, index) {
    return (
      <div className="historyTickets__list" onClick={this.goToDetailHistory.bind(this)} key={key + index ? index : 0}>
        <div className="historyTickets__list-titleEN">LOREM's IPSUM DOLOR.</div>
        <div className="historyTickets__list-titleTH">เทควันโดดีไซน์ไฮไลต์แรงผลักฮาร์ด</div>
        <div className="historyTickets__list-locationAndDate">
          <div className="historyTickets__list-location">รัชดา</div>
          <div className="historyTickets__list-date">3 ก.ย. (19:40)</div>
        </div>
      </div>   
    )
  }
  renderHistoryLists (aMonthIndex) {
    let lists = []
    for (let index = 0; index < 5; index++) {
      lists[index] = index
    }
    if (aMonthIndex === 0) {
      return lists.map((index) => {
        return this.renderEachList(aMonthIndex, index)
      })
    } else {
      return this.renderEachList(aMonthIndex)
    }
  }
  renderHistoryGroupByMonth () {
    let listsMonth = [ 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม' ]
    return listsMonth.map((aMonth, aMonthIndex) => {
      return (
      <div className="historyTickets__group" key={aMonth}>
        <div className="historyTickets__title">{aMonth} 2017</div>
        <div className="historyTickets__lists">
          {this.renderHistoryLists(aMonthIndex)}
        </div>
      </div>
      )
    })
  }
  componentWillMount() {
    this.state.isLoading = false
    this.state.isEmpty = false
  }
  render () {
    const {isLoading, error, isEmpty} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if(isEmpty){
      return <section className="empty"><img src={empty}/><h5>ท่านยังไม่มีตั๋วภาพยนตร์ กรุณาทำการจองตั๋ว</h5></section>
    }   
    return (
      <Layout title="History Tickets">
        <GlobalHeader handleBackButton={this.handleBackButton} titleMsg="ประวัติการใช้งาน"></GlobalHeader>
        <div className="historyTickets">
          {this.renderHistoryGroupByMonth()}
        </div>
      </Layout>
    )
  }
}
export default HistoryTickets