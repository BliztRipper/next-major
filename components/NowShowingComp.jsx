import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'

class RenderShowing extends PureComponent {
  movieProps(){
    let item = JSON.stringify(this.props.item)
    sessionStorage.setItem('movieSelect',item)
  }
  render(){
    return(
      <Fragment>
          <Link  prefetch href="/SelectCinemaByMovie">
            <div onClick={this.movieProps.bind(this)} className='showing__cell'>
              <img className='showing__poster' src={this.props.item.poster_ori}/>
              {(()=>{
                if(new Date().getTime() < new Date(this.props.item.release_date).getTime()) {
                  return(<img className='showing__advance' src='../static/advanceTicket.png'/>)
                }
              })()}
              <span className='showing__title'>{this.props.item.title_th}</span>
            </div>
          </Link>  
      </Fragment>
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

  sortTime(){
    let sorting = []
    this.state.dataObj.now_showing.map((item,i)=>{
      sorting.push(<RenderShowing item={item} release={item.release_date} key={i}/>)
    })
    let numArray = [...sorting].sort((a,b) => new Date(b.props.item.release_date) - new Date(a.props.item.release_date))
    return numArray
  }

  render() {
    return (
        <section>
          <div className='showing__container'>
          {this.sortTime()}
          </div>
        </section>
    );
  }
}

export default NowShowingComp;
