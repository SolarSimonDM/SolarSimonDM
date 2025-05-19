function enter_SOLAR() {
  document.getElementById("ENTER_SOLAR").style.display = "none";
  const terminal = document.getElementById("solarterminal");
  terminal.style.display = "block";
  solarterminal_start();
}

document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll(".solarterminal_content > div");
  const solarterminal_content = document.querySelector(".solarterminal_content");
  let index = 0;

  lines.forEach(line => (line.style.display = "none"));

  function showNext() {
    if (index >= lines.length) return;

    const line = lines[index];
    line.style.display = "block";
    solarterminal_content.scrollTop = solarterminal_content.scrollHeight;

    if (line.children.length > 0) {
      index++;
      setTimeout(showNext, 250);
    } else {
      const fullText = line.textContent;
      line.textContent = "";
      window.solartypewriter(line, fullText, 0, 10, () => {
        index++;
        setTimeout(showNext, 250);
      });
    }
  }

  window.solarterminal_start = showNext;
});