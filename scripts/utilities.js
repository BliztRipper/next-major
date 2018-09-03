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
  }
}