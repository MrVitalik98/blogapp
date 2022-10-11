
const months = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 
  'Oct', 'Nov', 'Dec'
]


export const getDate = (_date, isShowTime = true) => {
  if(_date) {
    const date = new Date(+_date)

    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    

    if(day < 10) day = '0' + day
    if(hours < 10) hours = '0' + hours
    if(minutes < 10) minutes = '0' + minutes


    const time = isShowTime ? `${hours}:${minutes}` : ''
    
    return `${months[month]} ${day}, ${year} ${time}`
  }

  return ''
}