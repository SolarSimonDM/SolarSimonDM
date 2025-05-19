window.solartypewriter = function(element, text, charIndex = 0, delay = 10, callback) {
  if (!element.parentElement.classList.contains("solartypewriter_effect")) {
    element.textContent = text;
    if (callback) callback();
    return;
  }

  if (charIndex < text.length) {
    element.textContent += text.charAt(charIndex);
    element.parentElement.scrollTop = element.parentElement.scrollHeight;
    setTimeout(() => window.solartypewriter(element, text, charIndex + 1, delay, callback), delay);
  } else {
    if (callback) callback();
  }
};