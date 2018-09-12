import React, { PureComponent, Fragment } from 'react'
import Link from 'next/link'
import { log } from 'util';

class CinemaWithShowtimeComp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cinema: this.props.cinema[0],
            schedule: this.props.schedule,
        }
    }

    renderSystem(sessionAttributesNames) {
        if (sessionAttributesNames) {
            return sessionAttributesNames.map(system => {
                return (<span>{system}</span>)
            })
        }
    }

    renderShowtimes(showtimes) {
        if (showtimes) {
            return showtimes.map(showtime => {
                return (
                    <span className="cinema__card-cbm__showtime">
                        {showtime.slice(11,16)}
                    </span>
                )
            })
        }
    }

    renderTheater() {
        if (this.state.schedule && this.state.schedule.Theaters) {
            return this.state.schedule.Theaters.map(theater => {
                return (
                    <div className="cinema__card-cbm--theatre-container">
                        <div className="cinema__card-cbm--theatre-wrapper">
                            <div className="cinema__card-cbm--theatre-title">{theater.ScreenName}</div>
                            <div className="VS00000001"></div>
                            <div className="">อังกฤษ</div>
                            {this.renderSystem(theater.SessionAttributesNames)}
                        </div>
                        <div className="cinema__card-cbm--timetable-wrap">
                            <div className="cinema__card-cbm--timetable">
                                {this.renderShowtimes(theater.Showtimes)}
                            </div>
                        </div>
                    </div>
                )
            })
        }
    }

    render() {
        const cineIdHide = {display:'none'}

        let dataToSelectCinema = {
            pathname: '/SelectMovieByCinema',
            query: {
              accid: this.props.accid
            }
          }

        let fav = false

        return (
            <div ref="searchCine" className="cinema__card-cbm" >
                <div className="cinema__card-cbm--title">
                    <div className={this.state.cinema.brandName!=""? this.state.cinema.brandName:'sprite-blank'}></div>
                    <div ref="cineName" className="cinema__card-cbm--branch">{this.state.cinema.branchName}</div>
                    <div ref="cineIdProp" style={cineIdHide}>{this.state.cinema.cinemaId}</div>
                    <div ref="classname" className={fav? 'sprite-favCinema active':'sprite-favCinema'}></div>
                </div>

                {this.renderTheater()}
            </div>
      )
    }
}

export default CinemaWithShowtimeComp