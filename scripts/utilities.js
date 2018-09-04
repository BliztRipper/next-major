export default {
  getStringDateTime (time) {
    let regexDateTime = RegExp('^([0-9]{4})-([0-9]{2})-([0-9]{2})[Tt]([0-9]{2}:[0-9]{2}).*$','g');
    let dateTimeArr = regexDateTime.exec(time)
    return {
      origin: dateTimeArr[0],
      year: dateTimeArr[1],
      month: dateTimeArr[2],
      day: dateTimeArr[3],
      time: dateTimeArr[4],
      hour: dateTimeArr[4].split(':')[0],
      minute: dateTimeArr[4].split(':')[1]
    }
  },
  getStringDateTimeFromTicket (date, time) {
    let year = parseInt(date.split('/')[2])
    let month = parseInt(date.split('/')[1]) - 1
    let day = parseInt(date.split('/')[0])
    let hour = parseInt(time.split(':')[0])
    let minute = parseInt(time.split(':')[1]) 
    return {
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      date : new Date(year, month, day, hour, minute)
    }
  }
}