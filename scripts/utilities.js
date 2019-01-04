import { log } from "util";

export default {
  getStringDateTime (time) {
    if (!time) return false
    let regexDateTime = RegExp('^([0-9]{4})-([0-9]{2})-([0-9]{2})[Tt]([0-9]{2}:[0-9]{2}).*$','g');
    let dateTimeArr = regexDateTime.exec(time)
    let convertedOrigin = dateTimeArr[0]
    let convertedYear = dateTimeArr[1]
    let convertedMonth = dateTimeArr[2]
    let convertedDay = dateTimeArr[3]
    let convertedTime = dateTimeArr[4]
    let convertedHour = dateTimeArr[4].split(':')[0]
    let convertedMinute = dateTimeArr[4].split(':')[1]

    return {
      origin: convertedOrigin,
      year: convertedYear,
      month: convertedMonth,
      day: convertedDay,
      time: convertedTime,
      hour: convertedHour,
      minute: convertedMinute,
      date : new Date(convertedYear, convertedMonth -= 1, convertedDay, convertedHour, convertedMinute)
    }
  },
  getStringDateTimeFromTicket (date, time) {
    let convertedYear = date ? parseInt(date.split('/')[2]) : false
    let convertedMonth = date ? parseInt(date.split('/')[1]) : false
    let convertedDay = date ? parseInt(date.split('/')[0]) : false
    let convertedHour = time ? parseInt(time.split(':')[0]) : false
    let convertedMinute = time ? parseInt(time.split(':')[1])  : false
    return {
      year: convertedYear,
      month: convertedMonth,
      day: convertedDay,
      hour: convertedHour,
      minute: convertedMinute,
      date : new Date(convertedYear, convertedMonth -= 1, convertedDay, convertedHour, convertedMinute)
    }
  },
  removeBookingInfoInSessionStorage () {
    sessionStorage.removeItem('BookingDate')
    sessionStorage.removeItem('BookingMovie')
    sessionStorage.removeItem('BookingDuration')
    sessionStorage.removeItem('BookingGenre')
    sessionStorage.removeItem('BookingCinema')
    sessionStorage.removeItem('BookingMovieTH')
    sessionStorage.removeItem('BookingPoster')
    sessionStorage.removeItem('BookingScreenName')
    sessionStorage.removeItem('BookingSeat')
    sessionStorage.removeItem('BookingAttributesNames')
    sessionStorage.removeItem('BookingCinemaOperatorCode')
    sessionStorage.removeItem('BookingTime')
    sessionStorage.removeItem('BookingPrice')
    sessionStorage.removeItem('BookingPriceDisplay')
    sessionStorage.removeItem('BookingUserSessionId')
    sessionStorage.removeItem('BookingUserPhoneNumber')
    sessionStorage.removeItem('BookingCurrentServerTime')
    sessionStorage.removeItem('movieSelect')
    sessionStorage.removeItem('BookingBranchLocation')
  },

  getSoundDisplay(sound) {
    return sound //wait disscus with major

    switch(sound) {
      case 'EN/TH': return 'อังกฤษ'
      case 'TH/--': return 'ไทย'
      case 'ST/EN': return 'SoundTrack'
      case 'ST/ET': return 'SoundTrack'
      case 'TH/EN': return 'ไทย'
      case 'ST/--': return 'SoundTrack'
      case 'ST/TH': return 'SoundTrack'
      case 'EN/--': return 'อังกฤษ'
      case 'TH/E1': return 'ไทย'
      case 'TH/E2': return 'ไทย'
      case 'TH/E3': return 'ไทย'
    }
  },

  getNameFromBranch(branch) {
    if (branch.NameAlt === "" || branch.NameAlt.length < 2) {
      return branch.Name
    }
    return branch.NameAlt
  },

  getBrandName(brandName) {
    return brandName.replace(/ +/g, "")
  },

  getMovieName(movieInfo) {
    if (movieInfo.title_th === "" || movieInfo.title_th.length < 2) {
      return movieInfo.title_th
    }
    return movieInfo.title_en
  },

  isFavorite(favorites, cinemaId) {
    let found = false
    if (favorites != null) {
      favorites.forEach(fav => {
        if (cinemaId == fav) {
          found = true
          return
        }
      })
    }
    return found
  },

  getSystemImg(formatCode) {
    switch(formatCode) {
      case '0000000013': return `../static/4-dx-3-d.png`
      case '0000000001': return `../static/4-dx-2-d.png`
      case '0000000002': return `../static/AD.png`
      case '0000000003': return `../static/A3D.png`
      case '0000000005': return `../static/digi-3-d.png`
      case '0000000006': return `../static/MX.png`
      case '0000000007': return `../static/MXD.png`
      case '0000000008': return `../static/imaxh-3-d.png`
      case '0000000009': return `../static/imaxd-3-d.png`
      // case '0000000011': return `../static/imaxvr.png` now hasn't picture
      case '0000000011': return `../static/SCX.png`
      case '0000000012': return `../static/kids.png`
      default: return ``
    }
  },

  getSystemImgFromShotName(shortName) {
    switch(shortName) {
      // case '4DX': return `../static/4-dx-3-d.png`
      // case '4DX': return `../static/4-dx-2-d.png`
      // case 'Atmos 3D': return `../static/A3D.png`
      // case '3D': return `../static/digi-3-d.png`
      // case 'Imax': return `../static/imaxd-2-d.png`
      // case 'Imax HF3D': return `../static/imaxh-3-d.png`
      // case 'Imax 3D': return `../static/imaxd-3-d.png`
      // case 'MXVR': return `../static/imaxvr.png` now hasn't picture
      // case 'Screen X': return `../static/SCX.png`
      // case 'KIDS': return `../static/kids.png`
      case 'IMAX': return `../static/MX.png`
      case '4DX': return `../static/4-dx.png`
      case 'Dolby Atmos': return `../static/AD.png`
      case 'Digital 3D': return `../static/D3D.png`
      case 'RealD': return `../static/reald.png`
      case 'ScreenX': return `../static/SCX.png`
      default: return ``
    }
  },

  getSystemNameFromShotName(shortName) {
    switch(shortName) {
      case '4D3': return '4D3'
      case '4DX': case '4D2': return '4D2'
      case 'AD': return 'Atmos Digital'
      case 'A3D': return 'Atmos Digital 3D'
      case 'D3D': return 'Digital 3D'
      case 'IMAX': case 'MX': return 'Imax'
      case 'MXD': return 'Imax Digital'
      case 'MXHFD3D': return 'Imax High Frame Rate Digital3D'
      case 'MXD3D': return 'ImaxDigital 3D'
      case 'MXVR': return 'Imax VR'
      case 'SCX': return 'Screen X'
      case 'KIDS': return 'KIDS'
      case 'RealD': return 'RealD'
      default: return 'Digital'
    }
  },
  bounceOnScroll () {
    let bounceOnScrollStyles = {
      disable: 'position: fixed; top: 0; left: 0; margin: 0; padding: 8px; width: 100vw; height: 100vh; overflow-x: hidden; overflow-y: scroll; -webkit-overflow-scrolling: touch; box-sizing: border-box;',
      enable: 'position: ; top: ; left: ; margin: ; padding: ; width: ; height: ; overflow-x: ; overflow-y: ; -webkit-overflow-scrolling: ; box-sizing: ;'
    }
    let documents = [document.documentElement, document.body]
    let setStyle = (styles) => {
      documents.forEach(element => element.style.cssText = styles);
    }
    let enable = () => {
      setStyle(bounceOnScrollStyles.enable)
    }
    let disable = () => {
      setStyle(bounceOnScrollStyles.disable)
    }
    return {
      enable: enable,
      disable: disable
    }
  },
  getShowtime (schedules, pickThisDay) {
    let theatres = {}
    let result = []
		if (schedules) {
			schedules.forEach((schedule, i) => {
        let showtime = schedule.Showtimes
				if (showtime.slice(0, 10) === pickThisDay) {
          if (!theatres[schedule.ScreenName]) {
            theatres[schedule.ScreenName] = {
              ...schedule,
              Showtimes: []
            }
            delete theatres[schedule.ScreenName]['MovieInTheaters']
            delete theatres[schedule.ScreenName]['SessionIds']
          }
					theatres[schedule.ScreenName].Showtimes.push({
            date: showtime.slice(0, 10),
            showtime: showtime.slice(11, 16),
            datetime: showtime,
            sessionId: schedule.SessionIds
          })
        }

      })
      Object.keys(theatres).forEach(key => {
        result.push(theatres[key])
      });
    }
    return result
  }
}