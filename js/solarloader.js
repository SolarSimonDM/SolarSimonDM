const solarloader_key = "solarvisitor_time_of_seeing_solarloader";
const now = Date.now();
const solartime_to_pass_before_showing_solarloader_again = 24 * 60 * 60 * 1000;
const solarvisitor_time_of_seeing_solarloader = localStorage.getItem(solarloader_key);

// Only skip loader if time has passed and user previously clicked Enter button from the terminal
if (solarvisitor_time_of_seeing_solarloader &&
    now - parseInt(solarvisitor_time_of_seeing_solarloader) < solartime_to_pass_before_showing_solarloader_again) {
    
    document.getElementById("solarloader").style.display = "none";
    document.getElementById("solarhome").style.display = "block";
    document.body.className = "solarbody_default";
} else {
    // Don't store timestamp yet — only show solarloader
    document.getElementById("solarhome").style.display = "none";
    document.body.className = "solarloader";
}

// Called when user actually clicks Enter button from terminal
function solarterminal_button_enter() {
    // Now save the time
    localStorage.setItem(solarloader_key, now.toString());

    document.getElementById("solarloader").style.display = "none";
    document.getElementById("solarhome").style.display = "block";
    document.body.className = "solarbody_default";
}