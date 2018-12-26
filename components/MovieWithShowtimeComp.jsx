import React, { PureComponent } from 'react'
import Link from 'next/link'
import utilities from '../scripts/utilities'
import MovieInfoByCinemaComp from '../components/MovieInfoByCinemaComp'
import FlipMove from 'react-flip-move'
import empty from '../static/icon-film-empty.svg'

class MovieWithShowtimeComp extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			accid: this.props.accid,
			movieList: null
		}
	}
	componentDidMount () {
		this.setState({
			movieList: JSON.parse(sessionStorage.getItem("now_showing"))
		})
	}

	handleScheduleSelected(theater, showtime) {
		sessionStorage.setItem('BookingTime', showtime.showtime)
		sessionStorage.setItem('BookingScreenName', theater.ScreenName)
		sessionStorage.setItem('BookingAttributesNames', theater.SessionAttributesNames)
		sessionStorage.setItem('BookingCinemaOperatorCode', theater.CinemaOperatorCode)
		sessionStorage.setItem('CinemaID', theater.CinemaId)
		sessionStorage.setItem('BookingDate', showtime.datetime)
		sessionStorage.setItem('movieSelect', JSON.stringify(this.getMovieInfo(theater.ScheduledFilmId)))
	}

	getMovieInfo(filmId) {
		let info = null
		if (this.state.movieList && this.state.movieList.length > 0) {
			this.state.movieList.forEach(movie => {
				if (movie.movieCode) {
					return movie.movieCode.forEach(code => {
						if (filmId == code) {
							info = movie
							return
						}
					})
				}
			})
		}
		return info
	}

	renderSystem(formatCode) {
		if (utilities.getSystemImg(formatCode)) {
			return <img src={utilities.getSystemImg(formatCode)} />
		}
	}

	renderSound(sessionAttributesNames) {
		if (sessionAttributesNames && sessionAttributesNames.length > 0) {
			return sessionAttributesNames.map(sound => {
				return `${utilities.getSoundDisplay(sound)} | `
			})
		}
	}

	renderShowtimes(theater) {

		return theater.showtimesFilterByDate.map((showtime, showtimeIndex) => {
			let dataToSeatMap = {
				pathname: '/seatMap',
				query: {
					...theater,
					SessionId: showtime.sessionId
				}
			}
			let keyShowTime = showtime.showtime + theater.ScreenNameAlt + showtimeIndex
			return (
				<Link prefetch href={dataToSeatMap} key={keyShowTime} >
					<span className="cinema__card-cbm__showtime" onClick={this.handleScheduleSelected.bind(this, theater, showtime)}>
						{showtime.showtime}
					</span>
				</Link>
			)
		});

	}

	renderTheater(theaters) {

		return theaters.map(theater => {

			let keyCardItem = theater.ScreenNameAlt
			return (
				<div className="cinema__card-cbm" key={keyCardItem}>
					<div className="cinema__card-cbm--theatre-container">
						<div className="cinema__card-cbm--theatre-wrapper">
							<div className="cinema__card-cbm--theatre-title">{theater.ScreenName}</div>
							<div className="cinema__card-cbm--theatre-type">
								{this.renderSystem(theater.FormatCode)}
							</div>
							<div className="sprite-sound"></div>
							<div className="">{this.renderSound(theater.SessionAttributesNames)}</div>
						</div>
						<div className="cinema__card-cbm--timetable-wrap">
							<div className="cinema__card-cbm--timetable">
								{this.renderShowtimes(theater)}
							</div>
						</div>
					</div>
				</div>
			)

		});

	}

	renderMovieCard () {

		let instantMovieInfo = ''
		let instantShowtimesFilterByDate = []
		let renderCardItems = []
		let allowRenderCard = false
		let instantPropsSchedules = this.props.schedules
		Object.keys(instantPropsSchedules).forEach((filmId, filmIdIndex, filmIdArray) => {

			instantMovieInfo = this.getMovieInfo(filmId)

			if (instantMovieInfo) {

				instantPropsSchedules[filmId].forEach(theater => {

					instantShowtimesFilterByDate = utilities.getShowtime(theater, this.props.pickThisDay)

					if (instantShowtimesFilterByDate.length > 0) {
						theater.showtimesFilterByDate = instantShowtimesFilterByDate
						allowRenderCard = true
					}

				});

				if (allowRenderCard) {

					renderCardItems.push(
						<FlipMove duration={600} className="cinema__cardItem-wrap isDiff" key={filmId} >
							<div className="cinema__cardItemTransition">
								<div className="cinema__cardItem isDiff">
									{<MovieInfoByCinemaComp item={instantMovieInfo} />}
									{this.renderTheater(instantPropsSchedules[filmId])}
								</div>
							</div>
						</FlipMove>
					)

				}

			}
		})

		if (renderCardItems.length > 0) {
			return renderCardItems
		} else {
			return (
				<section className="empty"><img src={empty}/><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/></h5></section>
			)
		}


	}

	render() {
		if (!this.state.movieList) return false
		return this.renderMovieCard()
	}
}

export default MovieWithShowtimeComp