function convert24hTo12h(time24h) {
  if(time24h.length < 1){
      return ""
  }
  let [hours, minutes] = time24h.split(':');
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  console.log('hours',hours)
  return `${hours}.${minutes} ${ampm}`;
}

function convert12hTo24h(time12h) {
  const [time, modifier] = time12h.toLowerCase().split(' ');
  if (!time || !modifier) return "";

  let [hours, minutes] = time.replace(".", ":").split(':');
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes || "0", 10);

  if (modifier === 'pm' && hours < 12) hours += 12;
  if (modifier === 'am' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}



function formatWeeklyHours(scheduleArray) {
  const result = {};

  for (const item of scheduleArray) {
    const { day, startTime, endTime, is24Hours } = item;

    if (is24Hours) {
      result[day] = 'Open 24 Hours';
    } else if (!startTime && !endTime) {
      result[day] = 'Closed';
    } else {
      result[day] = `${startTime}-${endTime}`;
    }
  } 
  console.log("Result from weekly hours", result)
  return result;
}



export {convert24hTo12h,formatWeeklyHours,convert12hTo24h}