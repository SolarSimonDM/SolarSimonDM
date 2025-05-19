document.addEventListener("DOMContentLoaded", function() {
const solarfooter = document.querySelector(".solarfooter");
window.addEventListener("scroll", function() {
    if (window.scrollY > 200) {
    solarfooter.classList.add("show");
    } else {
    solarfooter.classList.remove("show");
    }
});
});