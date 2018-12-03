import React, { PureComponent } from 'react'
import Link from 'next/link'
import utilities from '../scripts/utilities'
import MovieInfoByCinemaComp from '../components/MovieInfoByCinemaComp'
import FlipMove from 'react-flip-move'

class MovieWithShowtimeComp extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			accid: this.props.accid,
			movieList: null,
		}
	}
	componentDidMount () {
		this.setState({
			movieList: JSON.parse(sessionStorage.getItem("now_showing"))
		})
	}

	handleScheduleSelected(theater, showtime) {
		sessionStorage.setItem('BookingTime', showtime.slice(11, 16))
		sessionStorage.setItem('BookingScreenName', theater.ScreenName)
		sessionStorage.setItem('BookingAttributesNames', theater.SessionAttributesNames)
		sessionStorage.setItem('BookingCinemaOperatorCode', theater.CinemaOperatorCode)
		sessionStorage.setItem('CinemaID', theater.CinemaId)
		sessionStorage.setItem('BookingDate', showtime)
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

	renderShowtimes(theater, filmId) {

		let items = []
		if (theater.Showtimes) {
			theater.Showtimes.forEach((showtime, i) => {
				let dataToSeatMap = {
					pathname: '/seatMap',
					query: {
						...theater,
						SessionId: theater.SessionIds[i]
					}
				}

				if (showtime.slice(0, 10) == this.props.pickThisDay) {
					if(this.getMovieInfo(filmId) !== null){
						let keyShowTime = showtime.slice(11, 16) + theater.ScreenNameAlt + this.getMovieInfo(filmId).title_en + i
						items.push (
							<Link prefetch href={dataToSeatMap} key={keyShowTime}>
								<a className="cinema__card-cbm__showtime" onClick={this.handleScheduleSelected.bind(this, theater, showtime)}>
									{showtime.slice(11, 16)}
								</a>
							</Link>
						)
					}
				}
			})
		}
		return items
	}

	renderTheater(theaters, filmId) {
		let showtimesItems = true
		let isEmpty = true
		return theaters.map((theater, theaterIndex) => {
			showtimesItems = this.renderShowtimes(theater, filmId)

			let showtimesItemsLength = showtimesItems.length > 0
			if (showtimesItemsLength) {
				isEmpty = false
				let keyCardItem = theater.ScreenNameAlt + theaterIndex
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
									{showtimesItems}
								</div>
							</div>
						</div>
					</div>
				)
			} else {
				return !isEmpty
			}
		})
	}

	renderMovieCard() {
		let movieInfoItem = null
		let hasMovieInfo = false

    return Object.keys(this.props.schedules).map((filmId, filmIdIndex, filmIdArray) => {
			movieInfoItem = this.getMovieInfo(filmId)

			if (movieInfoItem) {
				hasMovieInfo = true
			}

      if (filmIdIndex + 1 === filmIdArray.length && !hasMovieInfo) {
        this.props.theaterEmptyCheck(true)
			}

			let theatersByFilmId = this.props.schedules[filmId]

      if (theatersByFilmId && movieInfoItem) {
				return (
					<FlipMove duration={600} className="cinema__cardItem-wrap isDiff" key={filmId} >
						<div className="cinema__cardItemTransition">
							<div className="cinema__cardItem isDiff">
								{<MovieInfoByCinemaComp item={movieInfoItem} />}
								{this.renderTheater(theatersByFilmId, filmId)}
							</div>
						</div>
					</FlipMove>
				)
      } else {
				return false
			}
    })
	}

	render() {
		if (!this.state.movieList) return false
		return this.renderMovieCard()
	}
}

export default MovieWithShowtimeComp