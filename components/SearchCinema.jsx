import React, { PureComponent, Fragment } from 'react';

class SearchCinema extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  searchItem(){
    let searchClass = this.refs.searchCine.innerText
  }

  render() {
    return (
      <section style={{position:'relative'}}>
        <div className="search-cinema">
          <div className="search-cinema-icon-search">
            <img src="../static/ic-search.svg" alt=""/>
          </div>
          <input onChange={this.props.onSearchChange} style={this.props.isSelectCinema ? {backgroundColor:'tranparent'}:{backgroundColor:'#fff'}} className={this.props.stickyItem ? "search-cinema__searchbox sticky":"search-cinema__searchbox"}placeholder="ค้นหาโรงภาพยนตร์ที่ต้องการ" type="text" name="" id=""/>
        </div>
        <div className="search-cinema__blur"></div>
      </section>
    )
  }
}

export default SearchCinema;