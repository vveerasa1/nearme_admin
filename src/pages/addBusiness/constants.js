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
        result[day] = `${formatTime(startTime)}-${formatTime(endTime)}`;
      }
    }
  
    return result;
  }
  
  function formatTime(timeStr) {
    // Expects input like "2.20 am"
    const [time, period] = timeStr.toLowerCase().split(' ');
    const [hour, minute] = time.split('.');
  
    const formattedHour = parseInt(hour, 10);
    const formattedMinute = minute.padEnd(2, '0');
  
    return `${formattedHour}:${formattedMinute}${period === 'am' ? 'a.m' : 'p.m'}`;
  }
  


  export {convert24hTo12h,formatWeeklyHours}