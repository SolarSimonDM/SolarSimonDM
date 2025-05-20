document.addEventListener("DOMContentLoaded", function () {
  const solarsections = document.querySelectorAll(".solarsection");

  const solarsectionMap = Array.from(solarsections).map((solarsection, index) => {
    // Only generate an ID if one is not already present
    let solarsection_id = solarsection.id;

    if (!solarsection_id) {
      const solartitle = solarsection.querySelector(".solartitle");
      const solartitle_text = solartitle?.textContent || `solarsection_${index}`;

      solarsection_id = solartitle_text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, "_")
        .replace(/\s+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");

      solarsection.id = solarsection_id;
    }

    return {
      solarsection_id,
      solarelement: solarsection
    };
  });

  window.addEventListener("scroll", function () {
    solarsectionMap.forEach(({ solarsection_id, solarelement }) => {
      const solarrectangle = solarelement.getBoundingClientRect();

      if (solarrectangle.top <= 250 && solarrectangle.bottom >= 500) {
        if (window.location.hash !== `#${solarsection_id}`) {
          history.replaceState(null, "", `#${solarsection_id}`);
        }
      }
    });
  });
});