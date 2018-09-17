import { Component } from 'react'
import Slider from 'react-slick';
class DateFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverTime: this.props.serverTime,
      dates: this.props.dates,
    }
  }
  sliderBeforeChange (oldIndex, newIndex) {
    console.log(newIndex, 'newIndex');
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

  renderDates() {
    let strToday = `${this.state.serverTime.slice(8,10)} ${this.getMonth(this.state.serverTime)}`
    console.log(this.state.dates, 'this.state.dates');

    return this.state.dates.map((date, i) => {
      console.log(date, 'date');

      let displayDate = `${date.slice(8,10)} ${this.getMonth(date)}`
      if (strToday == displayDate) {
        displayDate = "วันนี้"
      }
      return (
        <div className="date-filter__item" key={date}><span>{displayDate}</span></div>
      )
    })
  }
  render () {
    const { dates } = this.state
    let dateFilterSliderSettings = {
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      dots: false,
      arrows: false,
      focusOnSelect: true,
      swipeToSlide: true
    }
    return (
      <div className="date-filter">
        <Slider {...dateFilterSliderSettings} beforeChange={this.sliderBeforeChange.bind(this)}>
          {this.renderDates()}
        </Slider>
      </div>
    )
  }
}
export default DateFilters