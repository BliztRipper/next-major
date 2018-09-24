import { Component } from 'react'
import Swiper from 'swiper'
class DateFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverTime: this.props.serverTime,
      dates: this.props.dates,
    }
  }
  sliderBeforeChange (newIndex) {
    if (this.props.sliderBeforeChange) this.props.sliderBeforeChange(newIndex)
  }

  getMonth(date) {
    var monthNames = [
      "", "ม.ค.", "ก.พ.", "มี.ค.",
      "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.",
      "ส.ค.", "ก.ย.", "ค.ค.",
      "พฤ.ย.", "ธ.ค."
    ]
    let monthIndex = date.slice(5,7)
    let month = parseInt(monthIndex)
    return monthNames[month]
  }
  iniSlider () {
    const sliderSetting = {
      watchSlidesProgress: true,
      speed: 400,
      freeMode: true,
      slideToClickedSlide: true,
      freeModeMomentumVelocityRatio: 2,
      freeModeSticky: true
    }
    let swiper = new Swiper(this.refs.slider, sliderSetting)
    swiper.on('slideChange', () => { this.sliderBeforeChange(swiper.activeIndex) })
    return swiper
  }
  renderDates() {
    let strToday = `${this.state.serverTime.slice(8,10)} ${this.getMonth(this.state.serverTime)}`

    return this.state.dates.map((date, i) => {

      let displayDate = `${date.slice(8,10)} ${this.getMonth(date)}`
      if (strToday == displayDate) {
        displayDate = "วันนี้"
      }
      return (
        <div className="swiper-slide" key={date}>
          <div className="date-filter__item"><span>{displayDate}</span></div>
        </div>
      )
    })
  }
  componentDidMount() {
    this.iniSlider()
  }
  render () {
    let dateFilterClassname = 'date-filter'
    dateFilterClassname = this.props.additionalClass ? dateFilterClassname + ' ' + this.props.additionalClass : dateFilterClassname
    return (
      <div className={this.props.stickyItem ? "date-filter isSelectCinemaByMovie slick-initialized sticky" : dateFilterClassname}>
        <div className="swiper-container" ref="slider" key="slider">
          <div className="swiper-wrapper">
            {this.renderDates()}
          </div>
        </div>
      </div>
    )
  }
}
export default DateFilters