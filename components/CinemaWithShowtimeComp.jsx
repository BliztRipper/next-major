import React, { Component } from 'react'
import Link from 'next/link'
import utilities from '../scripts/utilities';

class CinemaWithShowtimeComp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			favActive: this.props.favActive,
			cinema: this.props.cinema,
			accid: this.props.accid,
			pickThisDay: this.props.pickThisDay,
			serverTime: this.props.serverTime
		}
	}

	handleScheduleSelected(theatre, showtime) {
		sessionStorage.setItem('BookingTime', showtime.showtime)
		sessionStorage.setItem('BookingScreenName', theatre.ScreenName)
		sessionStorage.setItem('BookingAttributesNames', theatre.SessionAttributesNames)
		sessionStorage.setItem('BookingCinemaOperatorCode', theatre.CinemaOperatorCode)
		sessionStorage.setItem('CinemaID', this.state.cinema.cinemaId)
		sessionStorage.setItem('BookingCinema', this.state.cinema.branchName)
		sessionStorage.setItem('BookingBranchLocation', JSON.stringify(this.state.cinema.branchLocation))
		sessionStorage.setItem('BookingDate', showtime.datetime)
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

	renderShowtimes(cinema) {

		return cinema.showtimesFilterByDate.map((theatre, showtimeIndex) => {

			return theatre.Showtimes.map((showtime) => {
				let dataToSeatMap = {
					pathname: '/seatMap',
					query: {
						...theatre,
						SessionId: showtime.sessionId
					}
				}

				let keyShowTime = showtime.showtime + theatre.ScreenNameAlt + showtimeIndex
				let showTimeDate = new Date(showtime.datetime)
				let nowDateFromServer = new Date(this.state.serverTime)

				if (showTimeDate.getTime() > nowDateFromServer.getTime()) {
					return (
						<Link prefetch href={dataToSeatMap} key={keyShowTime} >
							<span className="cinema__card-cbm__showtime" onClick={this.handleScheduleSelected.bind(this, theatre, showtime)}>
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
		});

	}

	renderTheater() {
		let items = []
		if (this.state.cinema.schedule && this.state.cinema.schedule.Theaters) {
			this.state.cinema.schedule.Theaters.forEach(theater => {
				if (theater.allowRender) {
					items.push (
						<div className="cinema__card-cbm--theatre-container" key={'container ' + theater.ScreenName + this.state.cinema.branchName + this.props.iAmFav}>
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
								<img src="../static/ic-sound.svg" className="icSvg icSvgSound" />
								<div className="">{this.renderSound(theater.MovieInTheaters[0].SessionAttributesNames)}</div>
							</div>
							<div className="cinema__card-cbm--theatre-titleSub">Screen Number {theater.ScreenNumber}</div>
							<div className="cinema__card-cbm--timetable-wrap">
								<div className="cinema__card-cbm--timetable">
									{this.renderShowtimes(theater)}
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
			<div className="cinema__card-cbm" >
				<div className="cinema__card-cbm--title" key="title">
					<div className="cinema__card-cbm--titleIcon">
						{(() => {
							if (this.state.cinema.brandId) {
								return <img src={`../static/brandIds/brand_id_${this.state.cinema.brandId}.png`} />
							} else {
								return false
							}
						})()}
					</div>
					<div ref="cineName" className="cinema__card-cbm--branch">
						<div>{this.state.cinema.branchName}</div>
						{/* <div>300 m</div> */}
					</div>
					<div className="favIconWrap">
						<div className={this.state.cinema.isFavorite ? 'favIcon active' : 'favIcon'} onClick={this.state.favActive.bind(this, this.state.cinema.cinemaId)}>
							<img src="../static/ic-star-outline.svg" alt="" />
							<img src="../static/ic-star-active.svg" alt="" />
						</div>
					</div>
				</div>
				{this.renderTheater()}
			</div>
		)
	}
}

export default CinemaWithShowtimeComp