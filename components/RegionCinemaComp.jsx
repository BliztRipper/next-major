import React, { Component } from 'react'
import CinemaWithShowtimeComp from '../components/CinemaWithShowtimeComp'
import CinemaWithOutShowtimeComp from '../components/CinemaWithOutShowtimeComp'
import utilities from '../scripts/utilities'

import Collapse, { Panel } from 'rc-collapse'
import '../styles/rcCollapse.scss'

class RegionCinemaComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favActive: this.props.favActive,
      region: this.props.region,
      isExpand: this.props.isExpand,
      iAmFav: this.props.iAmFav,
      accid: this.props.accid,
      iAmSystem: this.props.iAmSystem,
      activeKey: this.props.isExpand ? '1' : '0'
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
          <img src="../Home/static/ic-star-outline-highlight.svg" alt="" />
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
        onClick={this.toggleCollapse.bind(this)}>
        <div className="cinema__regional__header">
          <h5 className={classNameRegionTitle} key="text">
            {this.renderFavStar()}
            {name}
          </h5>
          <div
            className={this.state.isExpand ? "arrowIcon active" : "arrowIcon"}
            key="arrowIcon">
            {" "}
            <img src="../Home/static/ic-down-chevron.svg" alt="" />
          </div>
        </div>
      </div>
    );
  }

  renderCinema() {
    if (this.state.region && this.state.region.cinemas) {
      return this.state.region.cinemas.map((cinema, cinemaIndex) => {
        if (cinema.schedule) {
          if (cinema.allowRender) {
            return (
              <CinemaWithShowtimeComp
                iAmFav={this.props.iAmFav}
                key={cinema.cinemaId + cinemaIndex}
                accid={this.state.accid}
                cinema={cinema}
                showtimes={this.props.showtimes}
                pickThisDay={this.props.pickThisDay}
                favActive={this.state.favActive}
                serverTime={this.props.serverTime}
              />
            );
          } else {
            return false
          }
        } else {
          return (
            <CinemaWithOutShowtimeComp
              iAmFav={this.props.iAmFav}
              key={cinema.cinemaId + cinemaIndex}
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
    const {isExpand, iAmSystem, region, iAmFav, activeKey} = this.state
    let classNameCardItem = "cinema__cardItem";
    if (isExpand) {
      classNameCardItem = classNameCardItem + " active";
    }
    if (iAmSystem) {
      classNameCardItem = classNameCardItem + " groupBySystem";
    }

    return (
      <div className={classNameCardItem} key={region.name + iAmFav} >
        <Collapse defaultActiveKey={activeKey}>
          <Panel
            key="1"
            isActive={true}
            showArrow={false}
            header={this.renderHeader()}>
            {this.renderCinema()}
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default RegionCinemaComp;
