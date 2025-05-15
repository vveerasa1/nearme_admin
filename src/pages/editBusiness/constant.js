function convert24hTo12h(time24h) {
  if(time24h.length < 1){
      return ""
  }
  let [hours, minutes] = time24h.split(':');
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return `${hours}.${minutes} ${ampm}`;
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

  return result;
}



export {convert24hTo12h,formatWeeklyHours}