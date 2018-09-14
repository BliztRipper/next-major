import React, { PureComponent, Fragment } from 'react'
import CinemaWithShowtimeComp from '../components/CinemaWithShowtimeComp'
import {Collapse} from 'react-collapse'
import {presets} from 'react-motion'

class RegionCinemaComp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            favActive: this.props.favActive,
            region: this.props.region,
            isExpand: this.props.isExpand,
            iAmFav: this.props.iAmFav,
        }
    }

    toggleCollapse () {
        this.setState({
            isExpand: !this.state.isExpand
        })
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

    renderFavStar() {
        if (this.state.iAmFav) {
            return (
                <div className="cinema__regional__title-iconFav"><img src="../static/icon-star-orange-line.png" alt=""/></div>
            )
        }
    }

    renderHeader() {
        let name = this.state.region.name
        let classNameRegionTitle = 'cinema__regional__title'
        if (this.state.iAmFav) {
            name = "โรงภาพยนตร์ที่ชื่นชอบ"
            classNameRegionTitle = classNameRegionTitle + ' hasIcon'
        }
        return (
            <div className="cinema__regional" key={name} onClick={this.toggleCollapse.bind(this)}>
                <div className="cinema__regional__header">
                    <h5 className={classNameRegionTitle}>
                        {this.renderFavStar()}
                        {name}
                    </h5>
                    <div className={this.state.isExpand? 'arrowIcon active':'arrowIcon'} > <img src="../static/ic-arrow-back.png" alt=""/></div>
                </div>
            </div>
        )
    }

    renderCinema() {
        if (this.state.region && this.state.region.schedule) {
            let cinema = this.getCinema(this.state.region.schedule.CinemaId)
            if (cinema) {
                return (
                    <Fragment>
                        <CinemaWithShowtimeComp cinema={cinema} schedule={this.state.region.schedule} favActive={this.state.favActive}/>
                    </Fragment>
                )
            }
        }
    }

    render() {
        let classNameCardItem = 'cinema__cardItem'
        if (this.state.isExpand) {
            classNameCardItem = classNameCardItem + ' active'
        }

        return (
            <div className={classNameCardItem} key={this.state.region.name + this.state.iAmFav}>
                {this.renderHeader()}
                <Collapse isOpened={this.state.isExpand} springConfig={presets.stiffness}>
                    {this.renderCinema()}
                </Collapse>
            </div>
        )
    }
}

export default RegionCinemaComp