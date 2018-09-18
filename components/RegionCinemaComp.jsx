import React, { Component, Fragment } from 'react'
import CinemaWithShowtimeComp from '../components/CinemaWithShowtimeComp'
import CinemaWithOutShowtimeComp from '../components/CinemaWithOutShowtimeComp'
import {Collapse} from 'react-collapse'
import {presets} from 'react-motion'
import { log } from 'util';

class RegionCinemaComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favActive: this.props.favActive,
            region: this.props.region,
            isExpand: this.props.isExpand,
            iAmFav: this.props.iAmFav,
            accid: this.props.accid,
            pickThisDay: this.props.pickThisDay,
        }

    }

    toggleCollapse () {
        this.setState({
            isExpand: !this.state.isExpand
        })
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
        console.log(this.props.pickThisDay, 'pickThisDay renderCinema RegionCinemaComp');

        if (this.state.region && this.state.region.cinemas) {
            return this.state.region.cinemas.map(cinema => {
                if (cinema.schedule) {
                    return (
                        <Fragment>
                            <CinemaWithShowtimeComp accid={this.state.accid} cinema={cinema} pickThisDay={this.props.pickThisDay} favActive={this.state.favActive}/>
                        </Fragment>
                    )
                } else {
                    return (
                        <Fragment>
                            <CinemaWithOutShowtimeComp accid={this.state.accid} cinema={cinema} favActive={this.state.favActive}/>
                        </Fragment>
                    )
                }
            })
        }
    }

    render() {
        console.log(this.props.pickThisDay, 'pickThisDay render RegionCinemaComp');
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