import React, { Component, Fragment } from 'react'
import CinemaWithShowtimeComp from '../components/CinemaWithShowtimeComp'
import CinemaWithOutShowtimeComp from '../components/CinemaWithOutShowtimeComp'
import { Collapse } from 'react-collapse'
import { presets } from 'react-motion'
import utilities from '../scripts/utilities'

class RegionCinemaComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favActive: this.props.favActive,
      region: this.props.region,
      isExpand: this.props.isExpand,
      iAmFav: this.props.iAmFav,
      accid: this.props.accid,
      iAmSystem: this.props.iAmSystem
    };
  }

  toggleCollapse() {
    this.setState({
      isExpand: !this.state.isExpand
    });
  }

  renderFavStar() {
    if (this.state.iAmFav) {
      return (
        <div className="cinema__regional__title-iconFav">
          <img src="../static/icon-star-orange-line.png" alt="" />
        </div>
      );
    } else if (this.state.iAmSystem) {
      return (
        <div className="cinema__regional__title-iconFav">
          <img
            src={utilities.getSystemImgFromShotName(this.state.region.name)}
            alt=""
          />
        </div>
      );
    }
  }

  renderHeader() {
    let name = this.state.region.name;
    let classNameRegionTitle = "cinema__regional__title";
    if (this.state.iAmFav) {
      name = "โรงภาพยนตร์ที่ชื่นชอบ";
      classNameRegionTitle = classNameRegionTitle + " hasIcon";
    } else if (this.state.iAmSystem) {
      name = utilities.getSystemNameFromShotName(name);
      classNameRegionTitle = classNameRegionTitle + " hasIcon";
    }
    return (
      <div
        className="cinema__regional"
        key={name}
        onClick={this.toggleCollapse.bind(this)}
      >
        <div className="cinema__regional__header">
          <h5 className={classNameRegionTitle} key="text">
            {this.renderFavStar()}
            {name}
          </h5>
          <div
            className={this.state.isExpand ? "arrowIcon active" : "arrowIcon"}
            key="arrowIcon"
          >
            {" "}
            <img src="../static/ic-arrow-back.png" alt="" />
          </div>
        </div>
      </div>
    );
  }

  renderCinema() {
    if (this.state.region && this.state.region.cinemas) {
      return this.state.region.cinemas.map(cinema => {
        if (cinema.schedule) {
          return (
            <CinemaWithShowtimeComp
              iAmFav={this.props.iAmFav}
              key={cinema.name}
              accid={this.state.accid}
              cinema={cinema}
              pickThisDay={this.props.pickThisDay}
              favActive={this.state.favActive}
            />
          );
        } else {
          return (
            <CinemaWithOutShowtimeComp
              iAmFav={this.props.iAmFav}
              key={cinema.name}
              accid={this.state.accid}
              cinema={cinema}
              iAmSystem={this.state.iAmSystem}
              favActive={this.state.favActive}
            />
          );
        }
      });
    }
  }

  render() {
    let classNameCardItem = "cinema__cardItem";
    if (this.state.isExpand) {
      classNameCardItem = classNameCardItem + " active";
    }
    if (this.state.iAmSystem) {
      classNameCardItem = classNameCardItem + " groupBySystem";
    }

    return (
      <div
        className={classNameCardItem}
        key={this.state.region.name + this.state.iAmFav}
      >
        {this.renderHeader()}
        <Collapse
          key="collapse"
          isOpened={this.state.isExpand}
          springConfig={presets.stiffness}
        >
          {this.renderCinema()}
        </Collapse>
      </div>
    );
  }
}

export default RegionCinemaComp;
