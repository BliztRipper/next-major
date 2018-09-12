import React, { PureComponent, Fragment } from 'react'
import CinemaWithShowtimeComp from '../components/CinemaWithShowtimeComp'
import { log } from 'util';

class RegionCinemaComp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            region: this.props.region,
            isExpand: this.props.isExpand,
            iAmFav: this.props.iAmFav,
        }
    }

    getCinema(cinemaId) {
        if (this.state.region) {
            return this.state.region.region.filter(cinema => {
                if (cinema.cinemaId == cinemaId) {
                    return cinema
                }
            })
        }
        return null
    }

    renderHeader() {
        let name = this.state.region.name
        if (this.state.iAmFav) {
            name = "โรงภาพยนตร์ที่ชื่นชอบ"
        }
        return (
            <div className="cinema__regional" onClick={this.props.favActive.bind(this)} key={name}>
            <div className="cinema__regional__header">
                <h5 className="cinema__regional__title">{name}</h5>
                <div className={this.state.isExpand? 'sprite-chevronDown active':'sprite-chevronDown'} ></div>
            </div>
            </div>
        )
    }

    renderCinema() {
        if (this.state.region && this.state.region.schedule) {
            let cinema = this.getCinema(this.state.region.schedule.CinemaId)
            if (cinema) {
                return <CinemaWithShowtimeComp cinema={cinema} schedule={this.state.region.schedule}/>
            }
        }
    }

    render() {
        return (
            <Fragment>
                {this.renderHeader()}
                {this.renderCinema()}
            </Fragment>
        )
    }
}

export default RegionCinemaComp