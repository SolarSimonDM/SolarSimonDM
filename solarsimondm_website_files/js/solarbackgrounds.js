document.addEventListener("DOMContentLoaded", function () {
  const solarsections = document.querySelectorAll(".solarsection");
  const solarsectionMap = Array.from(solarsections).map(solarsection => {
    return {
      solarbackground: solarsection.getAttribute("data-solarbackground"),
      solarelement: solarsection
    };
  });

  window.addEventListener("scroll", function () {
    solarsectionMap.forEach(({ solarbackground, solarelement }) => {
      const solarrectangle = solarelement.getBoundingClientRect();
      
      if (solarrectangle.top <= 250 && solarrectangle.bottom >= 500) {
        document.body.style.background = solarbackground;
      }
    });
  });
});