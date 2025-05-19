document.addEventListener("DOMContentLoaded", function () {
  const solarsections = document.querySelectorAll(".solarsection");

  solarsections.forEach(solarsection => {
    const textStyleClass = solarsection.getAttribute("data-solartextstyle");
    if (textStyleClass) {
      solarsection.classList.add(textStyleClass);
    }
  });
});