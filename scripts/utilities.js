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
  }
}