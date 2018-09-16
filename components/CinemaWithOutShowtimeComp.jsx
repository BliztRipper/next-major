import React, { PureComponent, Fragment } from 'react'
import Link from 'next/link'
import { log } from 'util';
import utilities from '../scripts/utilities';

class CinemaWithOutShowtimeComp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            favActive: this.props.favActive,
            cinema: this.props.cinema,
        }

    }

    render() {
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
            </div>
      )
    }
}

export default CinemaWithOutShowtimeComp