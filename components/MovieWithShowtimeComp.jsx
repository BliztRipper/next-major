import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import { log } from 'util';
import utilities from '../scripts/utilities';
import MovieInfoByCinemaComp from '../components/MovieInfoByCinemaComp'

class MovieWithShowtimeComp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			schedule: this.props.schedule,
			accid: this.props.accid,
			movieList: null,
		}
	}

	componentDidMount() {
		this.setState({
			movieList: JSON.parse(sessionStorage.getItem("now_showing"))
		})
	}

	handleScheduleSelected(theater, showtime) {
		sessionStorage.setItem('BookingTime', showtime.slice(11, 16))
		sessionStorage.setItem('BookingScreenName', theater.ScreenName)
		sessionStorage.setItem('BookingAttributesNames', theater.SessionAttributesNames)
		sessionStorage.setItem('CinemaID', this.state.schedule.CinemaId)
		sessionStorage.setItem('BookingDate', showtime)
	}

	getMovieInfo(filmId) {
		let info = null
		if (this.state.movieList && this.state.movieList.length > 0) {
			this.state.movieList.forEach(movie => {
				return movie.movieCode.forEach(code => {
					if (filmId == code) {
						info = movie
						return
					}
				})
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
				return utilities.getSoundDisplay(sound)
			})
		}
	}

	renderShowtimes(showtimes, theater) {
		let items = []

		if (showtimes) {
			showtimes.forEach((showtime, i) => {
				let dataToSeatMap = {
					pathname: '/seatMap',
					query: {
						...theater,
						accid: this.state.accid,
						SessionId: theater.SessionIds[i]
					}
				}

				if (showtime.slice(0, 10) == this.props.pickThisDay) {
					items.push (
						<Link prefetch href={dataToSeatMap}>
							<span className="cinema__card-cbm__showtime" onClick={this.handleScheduleSelected.bind(this, theater, showtime)}>
								{showtime.slice(11, 16)}
							</span>
						</Link>
					)
				}
			})
		}

		return items
	}

	renderTheater(theater) {
		let items = this.renderShowtimes(theater.Showtimes, theater)

		if (items.length > 0) {
			return (
				<div className="cinema__cardItem isDiff">
					<MovieInfoByCinemaComp item={this.getMovieInfo(theater.ScheduledFilmId)} />
					<div className="cinema__card-cbm--theatre-container">
						<div className="cinema__card-cbm--theatre-wrapper">
							<div className="cinema__card-cbm--theatre-title">{theater.ScreenName}</div>
							<div className="cinema__card-cbm--theatre-type">
								{this.renderSystem(theater.formatCode)}
							</div>
							<div className="">{this.renderSound(theater.SessionAttributesNames)}</div>
						</div>
						<div className="cinema__card-cbm--timetable-wrap">
							<div className="cinema__card-cbm--timetable">
								{items}
							</div>
						</div>
					</div>
				</div>
			)
		}
	}

	renderMovieCard() {
		if (this.state.schedule.Theaters && this.state.schedule.Theaters.length > 0) {
			return this.state.schedule.Theaters.map(theater => {
				return (
					<Fragment>
						{this.renderTheater(theater)}
					</Fragment>
				)
			})
		}
	}

	render() {
		return (
			<div className="cinema__cardItem-wrap">
				{this.renderMovieCard()}
			</div>
		)
	}
}

export default MovieWithShowtimeComp