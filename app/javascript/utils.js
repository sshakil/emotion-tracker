
export function convertToYYYYMMDD(date) {
  const offset = date.getTimezoneOffset()
  const offsetted = new Date(date.getTime() - (offset*60*1000))
  return offsetted.toISOString().split('T')[0]
}

export function convertDateStringToDate(dateStr) {
  return new Date(dateStr + "T00:00")
}
