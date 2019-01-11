const axios = require('axios')
const apiUrlBase = 'https://api-cinema.truemoney.net'
let branchIncreasement = 0
let previousTheatreScreenNumber = ''
let previousSessionId = ''

const getSeatsIngroup = (cinema, theatre, moive) => {
  let cinemaId = cinema.ID
  let sessionId = moive.SessionIds
  let apiUrls = {
    ticketPrices : `${apiUrlBase}/TicketPrices/${cinemaId}/${sessionId}`,
    seatPlan : `${apiUrlBase}/SeatPlan/${cinemaId}/${sessionId}`
  }

  let instantData = {
    ticketPrices: '',
    seatPlan: ''
  }

  const mapTicketPricesWithSeatPlans = (ticketPrices, SeatPlan) => {

    let instantTicketAreas = ticketPrices.Tickets
    let instantSeatAreas = SeatPlan.SeatLayoutData.Areas
    instantSeatAreas.forEach(seatArea => {
      instantTicketAreas.forEach((ticketArea, ticketAreaIndex) => {
        if (seatArea.AreaCategoryCode === ticketArea.AreaCategoryCode && ticketArea.IsPackageTicket) {
          seatArea.Rows.forEach((seatRow) => {
            let seatsInRows = []
            if (seatRow.PhysicalName && seatRow.Seats && seatRow.Seats.length > 0) {
              seatRow.Seats.forEach((seat, seatIndex, seatArray) => {
                if (!seat.SeatsInGroup) {
                  seatsInRows.push(seat.Id)
                }
                if (seatIndex + 1 === seatArray.length && seatsInRows.length > 0) {
                  if (sessionId != previousSessionId) {
                    previousSessionId = sessionId
                    console.log('=====');
                    console.log('=====');
                    console.log(`Theatre Name: ${theatre.ScreenName} || Theatre Number: ${theatre.ScreenNumber}`);
                    console.log(`SessionId: ${sessionId} || Showtimes: ${moive.Showtimes}`);
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

  Object.keys(apiUrls).forEach(key => {
    axios({
      method: 'get',
      url: apiUrls[key]
    })
    .then((res) => {
      let instantTicketsOrSeatData = res.data
      if (instantTicketsOrSeatData.status_code === 0) {
        instantData[key] = instantTicketsOrSeatData.data
        if (instantData.ticketPrices && instantData.seatPlan) {
          mapTicketPricesWithSeatPlans(instantData.ticketPrices, instantData.seatPlan)
        }
      }
    })
    // .catch((error) => {
      // console.error(error.config.url, 'error')
    // })
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
  .then((res) => {
    let instantSchedulesDataInCinemas = res.data
    if (instantSchedulesDataInCinemas.status_code === 0) {
      instantSchedulesDataInCinemas.data[0].Theaters.forEach((theatre, theatreIndex) => {
        theatre.MovieInTheaters.forEach((moive, moiveIndex) => {
          getSeatsIngroup(cinema, theatre, moive)
        });
      });
    }
  })
  // .catch((error) => {
    // console.error(error.config.url, 'error')
  // })
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
      if (branchIncreasement < instantBranchesData.length) {
        getScheduleInBranchCinema(instantBranchesData[branchIncreasement])
        branchIncreasement += 1
      }
      if (branchIncreasement === instantBranchesData.length) {
        console.log(`========== END TASK ==========`);
        console.log('======================');
      }
    }
  })
  // .catch((error) => {
    // console.error(error.config.url, 'error')
  // })
}

getBranches()
