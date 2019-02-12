import React, { Component } from 'react'
import Link from 'next/link'
import utilities from '../scripts/utilities'
import MovieInfoByCinemaComp from '../components/MovieInfoByCinemaComp'
import FlipMove from 'react-flip-move'

class MovieWithShowtimeComp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			accid: this.props.accid,
			movieList: null,
			serverTime: this.props.serverTime
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
				return `${utilities.getSoundDisplay(sound)} ${sessionAttributesNames.length > 1 ? ' | ' : ''}`
			})
		}
	}

	renderShowtimes(theater) {
		return theater.Showtimes.map((showtime, showtimeIndex) => {
			let dataToSeatMap = {
				pathname: '/seatMap',
				query: {
					...theater,
					SessionId: showtime.sessionId
				}
			}

			let keyShowTime = showtime.showtime + theater.ScreenNameAlt + showtimeIndex
			let showTimeDate = utilities.convertToTimeStamp(showtime.datetime)
			let nowDateFromServer = utilities.convertToTimeStamp(this.state.serverTime)
			if (showTimeDate > nowDateFromServer) {
				return (
					<Link prefetch href={dataToSeatMap} key={keyShowTime} >
						<span className="cinema__card-cbm__showtime" onClick={this.handleScheduleSelected.bind(this, theater, showtime)}>
							{showtime.showtime}
						</span>
					</Link>
				)
			} else {
				return (
					<span className="cinema__card-cbm__showtime disable" key={keyShowTime} >
						{showtime.showtime}
					</span>
				)
			}
		});

	}

	renderTheater(theaters, CinemaId) {
		return theaters.map(theater => {
			theater.CinemaId = CinemaId
			let keyCardItem = theater.ScreenNameAlt
			return (
				<div className="cinema__card-cbm" key={keyCardItem}>
					<div className="cinema__card-cbm--theatre-container">
						<div className="cinema__card-cbm--theatre-wrapper">
							<div className="cinema__card-cbm--theatre-title">{theater.ScreenName}</div>
							{(() => {
								if (this.renderSystem(theater.FormatCode)) {
									return (
										<div className="cinema__card-cbm--theatre-type">
											{this.renderSystem(theater.FormatCode)}
										</div>
									)
								}
							})()}
							<img src="../Home/static/ic-sound.svg" className="icSvg icSvgSound" />
							<div className="">{this.renderSound(theater.SessionAttributesNames)}</div>
						</div>
						<div className="cinema__card-cbm--theatre-titleSub">Screen Number {theater.ScreenNumber}</div>
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
		let instantShowtimesFilterByDate = false
		let renderCardItems = []
		let instantPropsMovies = this.props.movies
		Object.keys(instantPropsMovies).forEach(filmId => {

			instantMovieInfo = this.getMovieInfo(filmId)

			if (instantMovieInfo) {

				let movie = instantPropsMovies[filmId]
				instantShowtimesFilterByDate = utilities.getShowtime(movie.schedules, this.props.pickThisDay)

				if (instantShowtimesFilterByDate && instantShowtimesFilterByDate.length > 0) {

					renderCardItems.push(
						<FlipMove duration={600} className="cinema__cardItem-wrap isDiff" key={filmId} >
							<div className="cinema__cardItemTransition">
								<div className="cinema__cardItem isDiff">
									{<MovieInfoByCinemaComp item={instantMovieInfo} />}
									{this.renderTheater(instantShowtimesFilterByDate, movie.CinemaId)}
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
				<section className="empty"><img src="../Home/static/icon-film-empty.svg"/><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/></h5></section>
			)
		}


	}

	render() {
		if (!this.state.movieList) return false
		return this.renderMovieCard()
	}
}

export default MovieWithShowtimeComp