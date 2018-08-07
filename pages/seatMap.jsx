import { PureComponent } from 'react'
import SeatMapDisplay from '../components/SeatMapDisplay'
import Layout from '../components/Layout'
import loading from '../static/loading.gif'

class seatMap extends PureComponent {
  constructor(props) {
    super(props);
      this.state = {
        dataObj: null,
        isLoading: true,
        error: null,
        areaData: null
      }
      this.getSeatPlans()
  }
  getSeatPlans () {
    try{
      fetch(`http://api-cinema.truemoney.net/SeatPlan/0000000002/42371`)
      .then(response => response.json())
      .then(data => this.setState({dataObj:data.data, isLoading: false}))
      .then(() => {
        this.mapArea()
      })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }
  mapArea () {
    this.setState({
      areaData: this.state.dataObj.SeatLayoutData.Areas
    })
  }
  render () {
    const {isLoading, error, areaData} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if (!areaData) {
      return false
    }
    return (
      <Layout>
        <div className="seatMap">
          <SeatMapDisplay areaData={areaData}></SeatMapDisplay>
        </div>
      </Layout>
    )
  }
}
export default seatMap