const axios = require('axios')
const apiUrlBase = 'https://api-cinema.truemoney.net'
let instantBranchesData
let branchIndex = 0
let totalSessionIds = 0
let totalTheatres = 0
let totalBranches = 0
let totalRequests = 0
let previousSessionId = ''
let previousTheatres = ''
let previousBranches = ''

const getQuantitySeatsInPackageMoreThanOne = (ticketsInPackageContent) => {
  let ticketIsPackgeMoreThanOne = false
  if (ticketsInPackageContent.length > 0) {
    let instantTicketQuantity = 0
    ticketsInPackageContent.forEach((ticketInPackage) => {
      instantTicketQuantity += ticketInPackage.Quantity
    })
    ticketIsPackgeMoreThanOne = instantTicketQuantity > 1 ? true : false
  }
  return ticketIsPackgeMoreThanOne
}

const mapTicketPricesWithSeatPlans = (ticketPrices, SeatPlan,cinema, theatre, movie, sessionId) => {
  console.log(`>>> Theatre Name: ${theatre.ScreenName} || Theatre Number: ${theatre.ScreenNumber} || SessionId: ${sessionId} || Showtimes: ${movie.Showtimes}`);
  let instantTicketAreas = ticketPrices.Tickets
  let instantSeatAreas = SeatPlan.SeatLayoutData.Areas
  instantSeatAreas.forEach((seatArea, seatAreaIndex, seatAreaArray) => {
    let lastSeatArea = seatAreaIndex + 1 === seatAreaArray.length
     instantTicketAreas.forEach((ticketArea, ticketAreaIndex, ticketAreaArray) => {
      let lastTicketArea = ticketAreaIndex + 1 === ticketAreaArray.length
      let ticketIsPackgeMoreThanOneSeats = getQuantitySeatsInPackageMoreThanOne(ticketArea.PackageContent.Tickets)
      if (seatArea.AreaCategoryCode === ticketArea.AreaCategoryCode && ticketIsPackgeMoreThanOneSeats) {
         seatArea.Rows.forEach((seatRow, seatRowIndex, seatRowArray) => {
          let lastRow = seatRowIndex + 1 === seatRowArray.length
          let seatsInRows = []
          if (seatRow.PhysicalName && seatRow.Seats && seatRow.Seats.length > 0) {
             seatRow.Seats.forEach((seat, seatIndex, seatArray) => {
              if (!seat.SeatsInGroup) {
                seatsInRows.push(seat.Id)
              }
              if (seatIndex + 1 === seatArray.length && seatsInRows.length > 0) {
                if (sessionId != previousSessionId) {
                  totalSessionIds += 1
                  previousSessionId = sessionId
                  console.log('.....');
                  console.log('.....');
                  console.log(`..... Theatre Name: ${theatre.ScreenName} || Screen Number: ${theatre.ScreenNumber}`);
                  console.log(`..... AreaCategoryCode: ${ticketArea.AreaCategoryCode} || Area Description: ${ticketArea.Description}`);
                  console.log(`..... SessionId: ${sessionId} || Showtimes: ${movie.Showtimes}`);
                  console.log(`..... SeatsInGroup : ${seat.SeatsInGroup}`);
                }
                if (cinema.ID != previousBranches) {
                  totalBranches += 1
                  previousBranches = cinema.ID
                  previousTheatres = ''
                }
                if (theatre.ScreenNumber != previousTheatres) {
                  totalTheatres += 1
                  previousTheatres = theatre.ScreenNumber
                }
                console.log('.........');
                console.log('.........');
                console.log(`......... row: ${seatRow.PhysicalName}`);
                console.log(`......... Seat IDs : ${seatsInRows.join()}`);
              }
            });
          }
        });
      }
    });
  });
}

const getSeatsIngroup = async (cinema, theatre, movie) => {
  let cinemaId = cinema.ID
  let sessionId = movie.SessionIds
  let apiUrls = {
    ticketPrices : `${apiUrlBase}/TicketPrices/${cinemaId}/${sessionId}`,
    seatPlan : `${apiUrlBase}/SeatPlan/${cinemaId}/${sessionId}`
  }

  let apiPromises = []
  Object.keys(apiUrls).forEach(key => {
    apiPromises.push(axios.get(apiUrls[key]))
  });

  totalRequests += 2
  return await axios.all(apiPromises)
  .then(axios.spread(async function (ticketPricesResponse, seatPlanResponse) {
    let instantTicketPricesData = ticketPricesResponse.data
    let instantSeatPlanResponseData = seatPlanResponse.data
    if (instantTicketPricesData.status_code === 0 && instantSeatPlanResponseData.status_code === 0 ) {
      return await mapTicketPricesWithSeatPlans(instantTicketPricesData.data, instantSeatPlanResponseData.data,cinema, theatre, movie, sessionId)
    }
  }))
  .catch(function (error) {
    console.log(`!!!! Error: ${error.config ? error.config.url : '' } >> function getSeatsIngroup`);
  })
  .then(function () {
    // always executed
  });

}

const getScheduleInBranchCinema = (cinema) => {
  let dataToGetSchedule = {
    cinemaId: cinema.ID,
    filmIds: []
  }
  // Get Schedules
  totalRequests += 1
  axios({
    method: 'post',
    url: `${apiUrlBase}/Schedule`,
    data: dataToGetSchedule
  })
  .then(async (res) => {
    let instantSchedulesDataInCinemas = res.data
    if (instantSchedulesDataInCinemas.status_code === 0 && instantSchedulesDataInCinemas.data[0] && instantSchedulesDataInCinemas.data[0].Theaters) {
      let theatres = instantSchedulesDataInCinemas.data[0].Theaters
      for (let theatresIndex = 0; theatresIndex < theatres.length; theatresIndex++) {
        let lastTheatre = theatresIndex + 1 === theatres.length
        let theatre = theatres[theatresIndex];
        for (let movieIndex = 0; movieIndex < theatre.MovieInTheaters.length; movieIndex++) {
          let lastMovie = movieIndex + 1 === theatre.MovieInTheaters.length
          let movie = theatre.MovieInTheaters[movieIndex];
          await getSeatsIngroup(cinema, theatre, movie)
        }
      }
    }
    console.log(`>>> Subtotal SessionIds : ${totalSessionIds}|| Requests ${totalRequests} || Theatres : ${totalTheatres} || Branches : ${totalBranches} `);
    branchIndex += 1
    if (branchIndex === instantBranchesData.length) {
      console.log(` Total SessionIds : ${totalSessionIds} || Requests ${totalRequests} || Theatres : ${totalTheatres} || Branches : ${totalBranches} `);
      console.log(`========== END TASK ==========`);
      console.log('======================');
      return
    }
    printCinema()
  })
  .catch(function (error) {
    console.log(`!!!! Error: ${error.config ? error.config.url : '' } >> function getScheduleInBranchCinema`);
  })
  .then(function () {
    // always executed
  });
}
const printCinema = () => {

  if (branchIndex < instantBranchesData.length) {
    console.log('.');
    console.log('.');
    console.log('.');
    console.log('.');
    console.log(`. CinemaId: ${instantBranchesData[branchIndex].ID} || Cinema Name: ${instantBranchesData[branchIndex].Name ? instantBranchesData[branchIndex].Name : instantBranchesData[branchIndex].NameAlt}`);
    console.log(`. On progress branch : ${branchIndex + 1}/${instantBranchesData.length}`);
    getScheduleInBranchCinema(instantBranchesData[branchIndex])
  }
}
const getBranches = () => {
  totalRequests += 1
  axios({
    method: 'get',
    url: `${apiUrlBase}/Branches`
  })
  .then((res) => {
    let instantBranchesRes = res.data
    if (instantBranchesRes.status_code === 0) {
      instantBranchesData = instantBranchesRes.data
      if (branchIndex === 0) {
        console.log('======================');
        console.log(`========== BEGIN TASK ==========`);
      }
      printCinema()
    }
  })
  .catch(function (error) {
    console.log(`!!!! Error: ${error.config ? error.config.url : '' }  >> function getBranches`);
  })
  .then(function () {
    // always executed
  });
}
getBranches()