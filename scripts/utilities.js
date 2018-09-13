export default {
  getStringDateTime (time) {
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
    sessionStorage.removeItem('BookingTime')
    sessionStorage.removeItem('BookingPrice')
    sessionStorage.removeItem('BookingPriceDisplay')
    sessionStorage.removeItem('BookingUserSessionId')
    sessionStorage.removeItem('BookingUserPhoneNumber')
    sessionStorage.removeItem('BookingCurrentServerTime')
  },

  getSoundDisplay(sound) {
    if(sound === 'EN/TH') {
      sound = 'อังกฤษ'
    }
    return sound
  },

  getNameFromBranch(branch) {
    if (branch.NameAlt === "") {
      return branch.Name
    }
    return branch.NameAlt
  },

  getBrandName(brandName) {
    return brandName.replace(/ +/g, "")
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
      case '0000000001': return `./static/4-dx-3-d.png`
      case '0000000002': return `./static/4-dx-2-d.png`
      case '0000000003': return `./static/AD.png`
      case '0000000004': return `./static/A3D.png`
      case '0000000006': return `./static/digi-3-d.png`
      case '0000000007': return `./static/MX.png`
      case '0000000008': return `./static/MXD.png`
      case '0000000009': return `./static/imaxh-3-d.png`
      case '0000000010': return `./static/imaxd-3-d.png`
      // case '0000000011': return `./static/imaxvr.png` now hasn't picture
      case '0000000012': return `./static/SCX.png`
      // case '0000000013': return `./static/kids.png`  now hasn't picture
      default: return `../static/digi-2-d.png`
    }
  }
}