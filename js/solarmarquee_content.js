function get_marquee_content() {
    const date = new Date();
    const get_min = String(date.getMinutes()).padStart(2, '0');
    const get_hour = String(date.getHours()).padStart(2, '0');
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const get_day = day[date.getDay()];
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const get_month = month[date.getMonth()];
    const get_year = date.getFullYear();

  return `Generating Solarzone log for webmasters: Living specimen detected; appears to be accessing website from the distant past year of ${get_year}, in the month of ${get_month}, on what is most positively a ${get_day}, with estimated local time of ${get_hour} hour(s) and ${get_min} minutes(s). N.B.: typical access time, no anomalies detected; probability of specimen using time-altering technologies: &sime; 25.1%. No atypical device medium detected. Couldn't fetch precise geographical information or planet of origin, but connection signal is getting picked up from the general Milky Way Galaxy area. Server farm temperature: usual temperature. No system overload, drive failure or component overheating. No corrupted or compromised file containers, virtual machines or host operating systems as yet. Log conclusion: no crucial dangers or fatal errors identified; deployDelta: false; selfDestruct: false; to call log function again in the coming timebits.`;
}