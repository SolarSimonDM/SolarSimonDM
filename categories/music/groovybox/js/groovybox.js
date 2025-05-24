// groovybox.js

document.addEventListener("DOMContentLoaded", () => {
  create_groovybox_HTML();

  // Introducing the groovybox player, the player to get all other players out of business or something.

  const groovybox_elements = {
    groovybox_player: document.querySelector(".groovybox_player"),
    groovytrack_list: document.querySelector(".groovytrack_list"),
    groovytrack_image: document.querySelector(".groovytrack_image"),
    groovytrack_progress_bar: document.querySelector(".groovytrack_progress_bar"),
    groovytrack_current_time: document.querySelector(".groovytrack_current_time"),
    groovytrack_duration_time: document.querySelector(".groovytrack_duration_time"),
    groovytrack_toggle_play: document.querySelector(".groovybox_toggle_play"),
    groovybox_play_pause_icon: document.querySelector(".groovybox_play_pause_icon"),
    groovybox_total_number_of_tracks: document.querySelector(".groovybox_total_number_of_tracks"),
    groovybox_total_runtime: document.querySelector(".groovybox_total_runtime")
  };

  let current_groovytrack_index = 0;

  // get data attributes
  const groovybox_master_wrapper = document.querySelector(".groovybox_master_wrapper");
  const baseAudioPath = groovybox_master_wrapper?.dataset?.audioPath || "";
  const baseImagePath = groovybox_master_wrapper?.dataset?.imagePath || "";
  const effective_folder = groovybox_master_wrapper?.dataset?.groovytrackFolder || "";

  // folder selector element
  const folderSelector = document.querySelector(".groovybox_folder_selector");
  if (folderSelector) {
    // set initial value from data attribute
    folderSelector.value = effective_folder;

    // change folder without changing url or reloading page
    folderSelector.addEventListener("change", () => {
      const selectedFolder = folderSelector.value;

      // filter tracks by selected folder and reset current track
      filtered_tracks = selectedFolder
        ? groovytracks_array.filter(track => track.groovytrack_folder === selectedFolder)
        : groovytracks_array;

      current_groovytrack_index = 0;
      load_groovytrack(current_groovytrack_index);
      show_groovybox_info();
      update_play_pause_icon(false);
    });
  }

  // filter tracks initially by data attribute folder
  let filtered_tracks = effective_folder
    ? groovytracks_array.filter(track => track.groovytrack_folder === effective_folder)
    : groovytracks_array;

  // turn seconds into minutes:seconds
  function seconds_to_minutes(time) {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return m + ':' + ('0' + s).slice(-2);
  }

  // get total duration of all tracks from the property "duration" of the filtered tracks
  function get_total_runtime() {
    let total_seconds = 0;
    for (const track of filtered_tracks) {
      const [min, sec] = track.duration.split(":").map(Number);
      total_seconds += min * 60 + sec;
    }
    const hours = Math.floor(total_seconds / 3600);
    total_seconds %= 3600;
    const minutes = Math.floor(total_seconds / 60);
    const seconds = total_seconds % 60;
    return `${hours}h ${minutes}m ${('0' + seconds).slice(-2)}s`;
  }

  // show tracks in ul, if press on li load_groovytrack, and autoscroll for current_li
  function update_groovytrack_list() {
    groovybox_elements.groovytrack_list.innerHTML = '<ul class="groovytrack_ul"></ul>';
    const ul = document.querySelector(".groovytrack_ul");

    filtered_tracks.forEach((groovytrack, index) => {
      const li = document.createElement("li");
      li.textContent = `${groovytrack.name} (${groovytrack.duration})`;
      if (index === current_groovytrack_index) li.classList.add("current");

      li.setAttribute("tabindex", "-1"); // prevent focus by default to avoid scroll jumps
      li.onclick = (e) => {
        e.preventDefault();
        load_groovytrack(index);
        groovybox_elements.groovybox_player.play();
        e.currentTarget.blur(); // remove focus after click to prevent page jump
      };
      ul.appendChild(li);
    });

    const current_li = ul.querySelector("li.current");
    if (current_li) current_li.scrollIntoView({ behavior: "auto", block: "nearest" }); // prevent scrolling page up
  }

  // load track, track image
  function load_groovytrack(index) {
    current_groovytrack_index = index;
    const groovytrack = filtered_tracks[index];

    groovybox_elements.groovybox_player.src = baseAudioPath + groovytrack.file;
    groovybox_elements.groovybox_player.load();

    groovybox_elements.groovytrack_image.src =
      groovytrack.image ? baseImagePath + 'thumbs/' + groovytrack.image : baseImagePath + "squirrel_GIF.gif";

    groovybox_elements.groovytrack_image.alt = "Thumbnail.";
    groovybox_elements.groovytrack_image.style.display = "block";

    update_groovytrack_list();
  }

  function update_play_pause_icon(is_playing) {
    groovybox_elements.groovybox_play_pause_icon.src = is_playing
      ? baseImagePath + "icon_pause.png"
      : baseImagePath + "icon_play.png";
    groovybox_elements.groovybox_play_pause_icon.alt = is_playing ? "Pause" : "Play";

    groovybox_elements.groovytrack_image.classList.remove("spin");
    if (is_playing) void groovybox_elements.groovytrack_image.offsetWidth;
    if (is_playing) groovybox_elements.groovytrack_image.classList.add("spin");
    groovybox_elements.groovytrack_image.classList.toggle("paused", !is_playing);
  }

  function change_groovytrack(offset) {
    const count = filtered_tracks.length;
    const new_index = (current_groovytrack_index + offset + count) % count;
    load_groovytrack(new_index);

    if (groovybox_elements.groovybox_player.paused) {
      groovybox_elements.groovybox_player.play().catch(() => {});
    }
  }

  // play/pause toggle click handler, with blur to prevent focus scroll
  groovybox_elements.groovytrack_toggle_play.onclick = (e) => {
    e.preventDefault();
    if (groovybox_elements.groovybox_player.paused) {
      groovybox_elements.groovybox_player.play();
    } else {
      groovybox_elements.groovybox_player.pause();
    }
    e.currentTarget.blur(); // remove focus after click to avoid scrolling
  };

  // previous track button click handler, with blur
  document.querySelector(".previous_groovytrack").onclick = (e) => {
    e.preventDefault();
    change_groovytrack(-1);
    e.currentTarget.blur();
  };

  // next track button click handler, with blur
  document.querySelector(".next_groovytrack").onclick = (e) => {
    e.preventDefault();
    change_groovytrack(1);
    e.currentTarget.blur();
  };

  groovybox_elements.groovybox_player.onended = () => change_groovytrack(1);
  groovybox_elements.groovybox_player.onplay = () => update_play_pause_icon(true);
  groovybox_elements.groovybox_player.onpause = () => update_play_pause_icon(false);

  groovybox_elements.groovybox_player.onloadedmetadata = () => {
    groovybox_elements.groovytrack_duration_time.textContent = seconds_to_minutes(groovybox_elements.groovybox_player.duration);
  };

  groovybox_elements.groovybox_player.ontimeupdate = () => {
    const cur = groovybox_elements.groovybox_player.currentTime;
    const dur = groovybox_elements.groovybox_player.duration || 1;
    groovybox_elements.groovytrack_progress_bar.value = (cur / dur) * 100;
    groovybox_elements.groovytrack_current_time.textContent = seconds_to_minutes(cur);
  };

  groovybox_elements.groovytrack_progress_bar.oninput = () => {
    groovybox_elements.groovybox_player.currentTime =
      (groovybox_elements.groovytrack_progress_bar.value / 100) * groovybox_elements.groovybox_player.duration;
  };

  function show_groovybox_info() {
    groovybox_elements.groovybox_total_number_of_tracks.textContent = `${filtered_tracks.length} tracks`;
    groovybox_elements.groovybox_total_runtime.textContent = get_total_runtime();
  }

  show_groovybox_info();

  // make audio element unfocusable to avoid scrolling on play/pause
  groovybox_elements.groovybox_player.setAttribute("tabindex", "-1");

  // always load first track
  load_groovytrack(current_groovytrack_index);

  window.scrollTo(0, 0);
});

function create_groovybox_HTML() {
  const groovybox_wrapper = document.createElement("div");
  groovybox_wrapper.className = "groovybox_wrapper";
  groovybox_wrapper.innerHTML = `
    <div class="groovybox_main">
      <div class="groovybox_title">GROOVYBOX</div>

      <select class="groovybox_folder_selector">
        <option value="general">general</option>
        <option value="TSTV">T.S.T.V. OST</option>
      </select>

      <img class="groovytrack_image" src="" alt="">
      <audio class="groovybox_player" preload="metadata" tabindex="-1">
        <source class="groovytrack" src="">
      </audio>
      <div class="groovybox_controls">
        <div class="groovybox_button_row">
          <button class="previous_groovytrack" type="button">
            <img class="groovybox_previous_track_icon" src="../../../media/images/groovybox/strawberry_button_flipped.png" alt="Previous track.">
          </button>
          <button class="groovybox_toggle_play" type="button">
            <img class="groovybox_play_pause_icon" src="../../../media/images/groovybox/icon_play.png" alt="Play.">
          </button>
          <button class="next_groovytrack" type="button">
            <img class="groovybox_next_track_icon" src="../../../media/images/groovybox/strawberry_button.png" alt="Next track.">
          </button>
        </div>
        <div class="groovytrack_progress_row">
          <input type="range" class="groovytrack_progress_bar" value="0" min="0" max="100" step="1">
          <span class="groovytrack_current_time">0:00</span> / <span class="groovytrack_duration_time">0:00</span>
        </div>
      </div>
      <div class="groovytracks_info">
        <div class="groovybox_total_number_of_tracks"></div>
        <div class="groovybox_total_runtime"></div>
      </div>
    </div>
    <div class="groovytrack_list"></div>
  `;
  const groovybox_master_wrapper = document.querySelector(".groovybox_master_wrapper");
  if (groovybox_master_wrapper) {
    groovybox_master_wrapper.appendChild(groovybox_wrapper);
  } else {
    console.error("no element with class 'groovybox_master_wrapper' found in dom");
  }
}