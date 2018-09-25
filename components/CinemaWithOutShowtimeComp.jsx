import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import { log } from 'util';
import utilities from '../scripts/utilities';

class CinemaWithOutShowtimeComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favActive: this.props.favActive,
            cinema: this.props.cinema,
            accid: this.props.accid
        }
    }

    handleSelectBranch () {
        sessionStorage.setItem('CinemaID', this.state.cinema.cinemaId)
        sessionStorage.setItem('BookingCinema', this.state.cinema.branchName)
    }

    render() {
        let dataToMovieByCinema = {
            pathname: '/SelectMovieByCinema'
        }
        return (
            <div ref="searchCine" className="cinema__card-cbm noTime">
                <div className="cinema__card-cbm--title">
                    <Link prefetch href={dataToMovieByCinema}>
                        <div className="cinema__card-cbm--titleIcon" onClick={this.handleSelectBranch.bind(this)}>
                            <img src="../static/major.png" alt=""/>
                        </div>
                    </Link>
                    <Link prefetch href={dataToMovieByCinema}>
                        <div ref="cineName" className="cinema__card-cbm--branch" onClick={this.handleSelectBranch.bind(this)}>
                            <div>{this.state.cinema.branchName}</div>
                            {/* <div>300 m</div> */}
                        </div>
                    </Link>
                    <div className="favIconWrap">
                        <div ref="classname" className={this.state.cinema.isFavorite? 'favIcon active':'favIcon'} onClick={this.state.favActive.bind(this, this.state.cinema.cinemaId)}>
                            <img src="../static/icon-star-orange-line.png" alt=""/>
                            <img src="../static/icon-star-orange.png" alt=""/>
                        </div>
                    </div>
                </div>
            </div>
      )
    }
}

export default CinemaWithOutShowtimeComp