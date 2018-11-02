import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'

class RenderShowing extends PureComponent {
  movieProps(){
    let item = JSON.stringify(this.props.item)
    sessionStorage.setItem('movieSelect',item)
  }
  render(){
    let dataToSelectCinemaByMovie = {
      pathname: '/SelectCinemaByMovie'
    }
    return(
      <Link  prefetch href={dataToSelectCinemaByMovie}>
        <div onClick={this.movieProps.bind(this)} className='showing__cell'>
          <img className='showing__poster' src={this.props.item.poster_ori}/>
          {(()=>{
            if(new Date().getTime() < new Date(this.props.item.release_date).getTime()) {
              return (
                <div className="advanceBadge">
                  <div className="advanceBadge--text">ตั๋วล่วงหน้า</div>
                  <img className='advanceBadge--img' src='../static/advanceTicket_bg.svg'/>
                </div>
              )
            }
          })()}
          <span className='showing__title'>{this.props.item.title_th}</span>
        </div>
      </Link>
    )
  }
}

class NowShowingComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: this.props.dataObj,
    }
  }

  displayMovies() {
    let displays = []
    this.state.dataObj.advance_ticket.map((item, i) => {
      displays.push(<RenderShowing item={item} release={item.release_date} key={"adv"+i} accid={this.props.accid} />)
    })

    this.state.dataObj.now_showing.map((item, i) => {
      displays.push(<RenderShowing item={item} release={item.release_date} key={"nowshow"+i} accid={this.props.accid} />)
    })

    return displays
  }

  render() {
    return (
      <section>
        <div className='showing__container'>
          {this.displayMovies()}
        </div>
      </section>
    );
  }
}

export default NowShowingComp;
