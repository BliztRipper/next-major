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
      serverTime: '2018-03-31T01:04:09Z'
    }
  }
  getStringDateTime (time) {
    let regexDateTime = RegExp('^([0-9]{4})-([0-9]{2})-([0-9]{2})[Tt]([0-9]{2}:[0-9]{2}).*$','g');
    let dateTimeArr = regexDateTime.exec(time)
    return {
      origin: dateTimeArr[0],
      year: dateTimeArr[1],
      month: dateTimeArr[2],
      day: dateTimeArr[3],
      time: dateTimeArr[4],
      hour: dateTimeArr[4].split(':')[0],
      minute: dateTimeArr[4].split(':')[1]
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
    for (let index = 0; index < 3; index++) {
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
    let maxMonths = 3
    let year = 2018
    let listsMonth = [ 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม' ]
    let serverYearToMonth = parseInt(this.getStringDateTime(this.state.serverTime).year) * 12
    let serverMonth = parseInt(this.getStringDateTime(this.state.serverTime).month) + maxMonths
    return listsMonth.map((aMonth, aMonthIndex) => {
      if ((year * 12) + aMonthIndex < serverYearToMonth + serverMonth) {
        return (
          <div className="historyTickets__group" key={aMonth}>
            <div className="historyTickets__title">{aMonth} {year}</div>
            <div className="historyTickets__lists">
              {this.renderHistoryLists(aMonthIndex)}
            </div>
          </div>
        )
      }
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