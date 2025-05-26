document.addEventListener("DOMContentLoaded", function () {

  function start_solarmarquee() {
    const solarmarquee_content = document.querySelector(".solarmarquee_content");
    const solarmarquee_wrapper = document.querySelector(".solarmarquee_wrapper");

    function update_content() {
      solarmarquee_content.innerHTML = get_marquee_content();
    }

    update_content();
    setInterval(update_content, 60000);

    let x = solarmarquee_wrapper.offsetWidth;
    const speed = 100;
    let last_timestamp = null;

    function step(timestamp) {
      if (!last_timestamp) last_timestamp = timestamp;
      const delta = (timestamp - last_timestamp) / 1000;
      last_timestamp = timestamp;

      x -= speed * delta;

      const content_width = solarmarquee_content.offsetWidth;
      if (x + content_width < 0) {
        x = solarmarquee_wrapper.offsetWidth;
      }

      solarmarquee_content.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // Mutation Observer section

  const solarhome = document.getElementById("solarhome");

  if (getComputedStyle(solarhome).display !== "none") {
    start_solarmarquee();
  } else {
    const observer = new MutationObserver(() => {
      if (getComputedStyle(solarhome).display !== "none") {
        observer.disconnect();
        start_solarmarquee();
      }
    });

    observer.observe(solarhome, { attributes: true, attributeFilter: ["style"] });
  }
});