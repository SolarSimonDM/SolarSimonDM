document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll("img.clickable_image").forEach(function(img) {
    img.style.cursor = "pointer";

    img.addEventListener("click", function () {
      window.location.href = img.src;
    });
  });

  const solarsections = document.querySelectorAll(".solarsection");

  const solarsectionMap = Array.from(solarsections).map((solarsection, index) => {
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

    const solarbackground = solarsection.getAttribute("data-solarbackground");

    return {
      solarsection_id,
      solarbackground,
      solarelement: solarsection
    };
  });

  window.addEventListener("scroll", function () {
    let closest_solarsection = null;
    let closest_distance = Infinity;

    solarsectionMap.forEach(({ solarsection_id, solarbackground, solarelement }) => {
      const rect = solarelement.getBoundingClientRect();

      if (rect.top <= 250 && rect.bottom >= 0) {
        const distance = Math.abs(rect.top - 250);
        if (distance < closest_distance) {
          closest_distance = distance;
          closest_solarsection = { id: solarsection_id, bg: solarbackground };
        }
      }
    });

    if (closest_solarsection) {
      if (window.location.hash !== `#${closest_solarsection.id}`) {
        history.replaceState(null, "", `#${closest_solarsection.id}`);
      }
      document.body.style.background = closest_solarsection.bg;
    }
  });
});