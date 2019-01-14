const axios = require('axios')
const apiUrlBase = 'https://api-cinema.truemoney.net'
let branchIncreasement = 0
let totalSessionIds = 0
let previousSessionId = ''

const mapTicketPricesWithSeatPlans = (ticketPrices, SeatPlan, theatre, movie, sessionId) => {
  console.log(`>>> Theatre Name: ${theatre.ScreenName} || Theatre Number: ${theatre.ScreenNumber} || SessionId: ${sessionId} || Showtimes: ${movie.Showtimes}`);
  let instantTicketAreas = ticketPrices.Tickets
  let instantSeatAreas = SeatPlan.SeatLayoutData.Areas
  instantSeatAreas.forEach((seatArea, seatAreaIndex, seatAreaArray) => {
    let lastSeatArea = seatAreaIndex + 1 === seatAreaArray.length
     instantTicketAreas.forEach((ticketArea, ticketAreaIndex, ticketAreaArray) => {
      let lastTicketArea = ticketAreaIndex + 1 === ticketAreaArray.length
      if (seatArea.AreaCategoryCode === ticketArea.AreaCategoryCode && ticketArea.IsPackageTicket) {
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
                  console.log('=====');
                  console.log('=====');
                  console.log(`Theatre Name: ${theatre.ScreenName} || Theatre Number: ${theatre.ScreenNumber}`);
                  console.log(`SessionId: ${sessionId} || Showtimes: ${movie.Showtimes}`);
                  console.log(`AreaCategoryCode: ${ticketArea.AreaCategoryCode}`);
                  console.log(`SeatsInGroup : ${seat.SeatsInGroup}`);
                  console.log('...');
                }
                console.log('...');
                console.log(`row: ${seatRow.PhysicalName}`);
                console.log(`Seat IDs : ${seatsInRows.join()}`);
                console.log('...');
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

  return await axios.all(apiPromises)
  .then(axios.spread(async function (ticketPricesResponse, seatPlanResponse) {
    let instantTicketPricesData = ticketPricesResponse.data
    let instantSeatPlanResponseData = seatPlanResponse.data
    if (instantTicketPricesData.status_code === 0 && instantSeatPlanResponseData.status_code === 0 ) {
      return await mapTicketPricesWithSeatPlans(instantTicketPricesData.data, instantSeatPlanResponseData.data,theatre, movie, sessionId)
    }
  }))
  .catch(function (error) {
    console.log(error);
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
  axios({
    method: 'post',
    url: `${apiUrlBase}/Schedule`,
    data: dataToGetSchedule
  })
  .then(async (res) => {
    let instantSchedulesDataInCinemas = res.data
    if (instantSchedulesDataInCinemas.status_code === 0) {
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
      console.log('Start next getBranches');
      getBranches()

    }

  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}
const getBranches = () => {
  axios({
    method: 'get',
    url: `${apiUrlBase}/Branches`
  })
  .then((res) => {
    let instantBranchesRes = res.data
    if (instantBranchesRes.status_code === 0) {
      let instantBranchesData = instantBranchesRes.data
      if (branchIncreasement === 0) {
        console.log('======================');
        console.log(`========== BEGIN TASK ==========`);
      }
      if (branchIncreasement < instantBranchesData.length) {
        console.log('===');
        console.log('===');
        console.log('===');
        console.log('===');
        console.log('===');
        console.log('===');
        console.log(`CinemaId: ${instantBranchesData[branchIncreasement].ID} || Cinema Name: ${instantBranchesData[branchIncreasement].Name ? instantBranchesData[branchIncreasement].Name : instantBranchesData[branchIncreasement].NameAlt}`);
        console.log(`Total Branch : ${branchIncreasement + 1}/${instantBranchesData.length}`);
        console.log('===');
        console.log('===');
        getScheduleInBranchCinema(instantBranchesData[branchIncreasement])
      }
      branchIncreasement += 1
      if (branchIncreasement === instantBranchesData.length) {
        console.log(`Total SessionIds : ${totalSessionIds}`);
        console.log(`========== END TASK ==========`);
        console.log('======================');
      }
    }
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}

getBranches()


// process.on('exit', function(code) {
  // getBranches()
  // return console.log(`About to exit with code ${code}`);
// });