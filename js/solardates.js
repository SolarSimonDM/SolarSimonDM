document.addEventListener("DOMContentLoaded", () => {
  const solarwrapper = document.querySelector(".solarwrapper");
  const solardate_sort_button = document.querySelector(".solardate_sort_button");

  if (!solarwrapper || !solardate_sort_button) return;

  const solarsections_array = Array.from(solarwrapper.querySelectorAll(".solarsection"));

  const solardate_sort = {
    solardate_sort_old_to_new: (a, b) =>
      new Date(a.querySelector(".solardate")?.textContent.trim()) -
      new Date(b.querySelector(".solardate")?.textContent.trim()),
    solardate_sort_new_to_old: (a, b) =>
      new Date(b.querySelector(".solardate")?.textContent.trim()) -
      new Date(a.querySelector(".solardate")?.textContent.trim())
  };

  const solarsections_order = (solarsections) => {
    solarsections.forEach(solarsection => solarwrapper.appendChild(solarsection));
  };

  // Default sort: new to old
  solarsections_order([...solarsections_array].sort(solardate_sort.solardate_sort_new_to_old));

  solardate_sort_button.addEventListener("change", () => {
    const selected_solardate_id = solardate_sort_button.selectedOptions[0]?.id;

    if (selected_solardate_id in solardate_sort) {
      solarsections_order([...solarsections_array].sort(solardate_sort[selected_solardate_id]));
    }
  });
});
