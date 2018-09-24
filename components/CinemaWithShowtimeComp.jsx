import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import { log } from 'util';
import utilities from '../scripts/utilities';

class CinemaWithShowtimeComp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			favActive: this.props.favActive,
			cinema: this.props.cinema,
			accid: this.props.accid,
			pickThisDay: this.props.pickThisDay,
		}

	}

	handleScheduleSelected(theater, showtime) {
		sessionStorage.setItem('BookingTime', showtime.slice(11, 16))
		sessionStorage.setItem('BookingScreenName', theater.ScreenName)
		sessionStorage.setItem('BookingAttributesNames', theater.SessionAttributesNames)
		sessionStorage.setItem('CinemaID', this.state.cinema.cinemaId)
		sessionStorage.setItem('BookingCinema', this.state.cinema.branchName)
		sessionStorage.setItem('BookingDate', showtime)
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
						SessionId: theater.SessionIds[i]
					}
				}

				if (showtime.slice(0, 10) == this.props.pickThisDay) {
					let keyShowTime = showtime.slice(11, 16) + theater.ScreenNameAlt + i
					items.push (
						<Link prefetch href={dataToSeatMap} key={keyShowTime} >
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

	renderTheater() {
		let items = []

		if (this.state.cinema.schedule && this.state.cinema.schedule.Theaters) {
			this.state.cinema.schedule.Theaters.forEach(theater => {
				let objShowtimes = this.renderShowtimes(theater.Showtimes, theater)
				if (objShowtimes.length > 0) {
					items.push (
						<div className="cinema__card-cbm--theatre-container" key={'container ' + theater.ScreenName + this.state.cinema.branchName + this.props.iAmFav}>
							<div className="cinema__card-cbm--theatre-wrapper">
								<div className="cinema__card-cbm--theatre-title">{theater.ScreenName}</div>
								<div className="cinema__card-cbm--theatre-type">
									{this.renderSystem(theater.formatCode)}
								</div>
								<div className="">{this.renderSound(theater.SessionAttributesNames)}</div>
							</div>
							<div className="cinema__card-cbm--timetable-wrap">
								<div className="cinema__card-cbm--timetable">
									{this.renderShowtimes(theater.Showtimes, theater)}
								</div>
							</div>
						</div>
					)
				}
			})
		}

		return items
	}

	render() {
		return (
			<div ref="searchCine" className="cinema__card-cbm" >
				<div className="cinema__card-cbm--title" key="title">
					<div className="cinema__card-cbm--titleIcon">
						<img src="../static/major.png" alt="" />
					</div>
					<div ref="cineName" className="cinema__card-cbm--branch">
						<div>{this.state.cinema.branchName}</div>
						{/* <div>300 m</div> */}
					</div>
					<div ref="classname" className={this.state.cinema.isFavorite ? 'favIcon active' : 'favIcon'} onClick={this.state.favActive.bind(this, this.state.cinema.cinemaId)}>
						<img src="../static/icon-star-orange-line.png" alt="" />
						<img src="../static/icon-star-orange.png" alt="" />
					</div>
				</div>

				{this.renderTheater()}
			</div>
		)
	}
}

export default CinemaWithShowtimeComp