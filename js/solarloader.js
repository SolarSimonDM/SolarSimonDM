const url_params = new URLSearchParams(window.location.search);
const skip_solarloader = url_params.get("ss") === "1";

const solarloader_key = "solarvisitor_time_of_seeing_solarloader";
const now = Date.now();
const solartime_to_pass_before_showing_solarloader_again = 7 * 24 * 60 * 60 * 1000;
const solarvisitor_time_of_seeing_solarloader = localStorage.getItem(solarloader_key);

// If url has ss=1, skip solarloader
if (skip_solarloader) {
    document.getElementById("solarloader").style.display = "none";
    document.getElementById("solarhome").style.display = "block";
    document.body.className = "solarbody_homepage";
} else if (
    solarvisitor_time_of_seeing_solarloader &&
    now - parseInt(solarvisitor_time_of_seeing_solarloader) < solartime_to_pass_before_showing_solarloader_again
) {
    document.getElementById("solarloader").style.display = "none";
    document.getElementById("solarhome").style.display = "block";
    document.body.className = "solarbody_homepage";
} else {
    document.getElementById("solarhome").style.display = "none";
    document.body.className = "solarloader";
    document.getElementById("ENTER_SOLAR").style.display = "block";
}

function solarterminal_button_enter() {
    localStorage.setItem(solarloader_key, now.toString());
    document.getElementById("solarloader").style.display = "none";
    document.getElementById("solarhome").style.display = "block";
    document.body.className = "solarbody_homepage";
}