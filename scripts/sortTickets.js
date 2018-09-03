export default {
  byTime (arr) {
    function compareNumerically (a, b) {
      function convertTimeToMins(timeStr) {
        return parseInt(timeStr.split(':')[0]) * 60 + parseInt(timeStr.split(':')[1])
      }
      let timeA = convertTimeToMins(a.BookingTime)
      let timeB = convertTimeToMins(b.BookingTime)
      return timeA - timeB
    }
    return arr.sort(compareNumerically)
  },
  byName (arr) {
    function compareAlphabet (a, b) {
      if (a.BookingMovie < b.BookingMovie)
        return -1;
      if (a.BookingMovie > b.BookingMovie)
        return 1;
      return 0;
    }
    return arr.sort(compareAlphabet)
  }
}