export function getDateTimeString(){
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()
  const hours = now.getHours()
  const min = now.getMinutes()
  const sec = now.getSeconds()
  const formattedDate = `${year}-${month}-${day} ${hours}:${min}:${sec} -003Z`
  console.log(formattedDate)
  const newDate = new Date(formattedDate).toISOString()
  const final = newDate.slice(0,19).replace('T', ' ')
  return final
}

export function getDateTimeNow(){
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()
  const hours = now.getHours()
  const min = now.getMinutes()
  const sec = now.getSeconds()
  const formattedDate = `${year}-${month}-${day} ${hours}:${min}:${sec} -003Z`
  const newDate = new Date(formattedDate)
  return newDate
}

export function formatStringToDate(date: Date){
  const returnDate = new Date(date)
  return returnDate
}