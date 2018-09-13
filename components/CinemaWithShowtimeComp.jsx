import React, { PureComponent, Fragment } from 'react'
import Link from 'next/link'
import { log } from 'util';
import utilities from '../scripts/utilities';

class CinemaWithShowtimeComp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            favActive: this.props.favActive,
            cinema: this.props.cinema[0],
            schedule: this.props.schedule,
        }

    }

    renderSystem(sessionAttributesNames) {
        if (sessionAttributesNames) {
            return sessionAttributesNames.filter(formatCode => {
                if (utilities.getSystemImg(formatCode)) {
                    return <img src={utilities.getSystemImg(formatCode)} />
                }
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
                            <div className="cinema__card-cbm--theatre-type">
                                {this.renderSystem(theater.SessionAttributesNames)}
                            </div>
                            <div className="">อังกฤษ</div>
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

        let dataToSelectCinema = {
            pathname: '/SelectMovieByCinema',
            query: {
              accid: this.props.accid
            }
          }

        return (
            <div ref="searchCine" className="cinema__card-cbm" >
                <div className="cinema__card-cbm--title">
                    <div className="cinema__card-cbm--titleIcon">
                        <img src="../static/major.png" alt=""/>
                    </div>
                    <div ref="cineName" className="cinema__card-cbm--branch">
                        <div>{this.state.cinema.branchName}</div>
                        {/* <div>300 m</div> */}
                    </div>
                    <div ref="classname" className={this.state.cinema.isFavorite? 'favIcon active':'favIcon'} onClick={this.state.favActive.bind(this, this.state.cinema.cinemaId)}>
                        <img src="../static/icon-star-orange-line.png" alt=""/>
                        <img src="../static/icon-star-orange.png" alt=""/>
                    </div>
                </div>

                {this.renderTheater()}
            </div>
      )
    }
}

export default CinemaWithShowtimeComp