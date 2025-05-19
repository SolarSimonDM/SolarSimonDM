document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("img").forEach(function(img) {
    img.style.cursor = "pointer";

    img.addEventListener("click", function () {
      window.location.href = img.src;
    });
  });
});