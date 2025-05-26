document.addEventListener("DOMContentLoaded", function () {
  const solarchats = document.querySelector(".solarchats");
  const solarchats_content = document.querySelector(".solarchats_content");

  function get_random_solarchat() {
    const random_index = Math.floor(Math.random() * solarchats_array.length);
    return solarchats_array[random_index];
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function render_solarchat(solarchat_log) {
    solarchats_content.innerHTML = "";

    for (const message of solarchat_log) {
      const message_html = `
        <div class="solarchats_message">
          <div class="solarchats_image_and_message_wrapper">
            <div class="solarchats_image_and_message_wrapper_item">
              <div class="solarchats_message_sender_image">
                <img src="${message.solarchats_message_sender_image}" alt="Avatar.">
              </div>
            </div>
            <div class="solarchats_image_and_message_wrapper_item">
              <div class="solarchats_message_sender">${message.solarchats_message_sender}</div>
              <div class="solarchats_message_text">
                <p>${message.solarchats_message_text}</p>
              </div>
            </div>
          </div>
        </div>
      `;

      solarchats_content.insertAdjacentHTML("beforeend", message_html);

      solarchats.scrollTo({
        top: solarchats.scrollHeight,
        behavior: "smooth"
      });

      const duration_in_seconds = parseFloat(message.solarchats_message_text_duration) || 3;
      const delay_in_ms = duration_in_seconds * 1000;
      await delay(delay_in_ms);
    }
  }

  // Mutation Observer section

  const solarhome = document.getElementById("solarhome");

  if (getComputedStyle(solarhome).display !== "none") {
    render_solarchat(get_random_solarchat());
  } else {
    const observer = new MutationObserver(() => {
      if (getComputedStyle(solarhome).display !== "none") {
        observer.disconnect();
        render_solarchat(get_random_solarchat());
      }
    });

    observer.observe(solarhome, { attributes: true, attributeFilter: ["style"] });
  }
});