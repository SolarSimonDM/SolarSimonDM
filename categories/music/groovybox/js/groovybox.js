// groovybox.js

document.addEventListener("DOMContentLoaded", () => {
  const master_wrappers = document.querySelectorAll(".groovybox_master_wrapper");

  master_wrappers.forEach((wrapper) => {
    create_groovybox_HTML(wrapper);

    // Introducing the groovybox player, the player to get all other players out of business or something.

    const groovybox_elements = {
      groovybox_player: wrapper.querySelector(".groovybox_player"),
      groovytrack_list: wrapper.querySelector(".groovytrack_list"),
      groovytrack_image: wrapper.querySelector(".groovytrack_image"),
      groovytrack_progress_bar: wrapper.querySelector(".groovytrack_progress_bar"),
      groovytrack_current_time: wrapper.querySelector(".groovytrack_current_time"),
      groovytrack_duration_time: wrapper.querySelector(".groovytrack_duration_time"),
      groovytrack_toggle_play: wrapper.querySelector(".groovybox_toggle_play"),
      groovybox_play_pause_icon: wrapper.querySelector(".groovybox_play_pause_icon"),
      groovybox_total_number_of_tracks: wrapper.querySelector(".groovybox_total_number_of_tracks"),
      groovybox_total_runtime: wrapper.querySelector(".groovybox_total_runtime"),
      previous_button: wrapper.querySelector(".previous_groovytrack"),
      next_button: wrapper.querySelector(".next_groovytrack"),
      volume_slider: wrapper.querySelector("#groovybox_volume_slider"),
    };

    let current_groovytrack_index = 0;

    // data attributes from the HTML
    const base_audio_path = wrapper.dataset.audioPath || "";
    const base_image_path = wrapper.dataset.imagePath || "";
    const base_folder = wrapper.dataset.groovytrackFolder || "";
    const show_folders = wrapper.dataset.showFolders !== "false";
    const specific_track_name = wrapper.dataset.specificGroovytrack;

    let filtered_groovytracks;

    if (specific_track_name) {
      filtered_groovytracks = groovytracks_array.filter(track => track.name === specific_track_name);
    } else if (base_folder) {
      filtered_groovytracks = groovytracks_array.filter(track => {
        return Array.isArray(track.groovytrack_folder) ?
          track.groovytrack_folder.includes(base_folder) :
          track.groovytrack_folder === base_folder;
      });
    } else {
      filtered_groovytracks = groovytracks_array;
    }

    // folder selector
    const groovybox_folder_selector = wrapper.querySelector(".groovybox_folder_selector");
    if (groovybox_folder_selector) {
      groovybox_folder_selector.value = base_folder;

      groovybox_folder_selector.addEventListener("change", () => {
        const selected_groovybox_folder = groovybox_folder_selector.value;

        // filter tracks by selected folder, reset current track
        filtered_groovytracks = selected_groovybox_folder ?
          groovytracks_array.filter(track => {
            return Array.isArray(track.groovytrack_folder) ?
              track.groovytrack_folder.includes(selected_groovybox_folder) :
              track.groovytrack_folder === selected_groovybox_folder;
          }) :
          groovytracks_array;

        current_groovytrack_index = 0;
        load_groovytrack(current_groovytrack_index);
        show_groovybox_info();
        update_play_pause_icon(false);
      });
    }

    // seconds to minutes:seconds
    function seconds_to_minutes(time) {
      const m = Math.floor(time / 60);
      const s = Math.floor(time % 60);
      return m + ':' + ('0' + s).slice(-2);
    }

    // get total duration of all tracks
    function get_total_runtime() {
      let total_seconds = 0;
      for (const track of filtered_groovytracks) {
        const [min, sec] = track.duration.split(":").map(n => parseInt(n, 10));
        if (isNaN(min) || isNaN(sec)) continue;
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
      const ul = wrapper.querySelector(".groovytrack_ul");

      filtered_groovytracks.forEach((groovytrack, index) => {
        const li = document.createElement("li");
        const artists = Array.isArray(groovytrack.artist) ? groovytrack.artist.join(", ") : groovytrack.artist;
        const artist_text = artists ? ` [${artists}]` : "";
        li.innerHTML = `${groovytrack.name} (${groovytrack.duration})` +
          (artists ? ` <span class="artist_name">[${artists}]</span>` : "");
        if (index === current_groovytrack_index) li.classList.add("current");

        li.setAttribute("tabindex", "-1"); // prevent focus by default to avoid scroll jumps
        li.onclick = (e) => {
          e.preventDefault();
          load_groovytrack(index);
          groovybox_elements.groovybox_player.play();
        };
        ul.appendChild(li);
      });

      const current = ul?.querySelector("li.current");

      if (ul && current) {
        const relativeOffset = current.offsetTop - ul.offsetTop;
        ul.scrollTop = relativeOffset;
      }
    }

    // load track, track image
    function load_groovytrack(index) {
      current_groovytrack_index = index;
      const groovytrack = filtered_groovytracks[index];

      groovybox_elements.groovybox_player.src = base_audio_path + groovytrack.file;
      groovybox_elements.groovybox_player.load();

      groovybox_elements.groovytrack_image.src =
        groovytrack.image ? base_image_path + 'thumbs/' + groovytrack.image : base_image_path + "squirrel_GIF.gif";

      groovybox_elements.groovytrack_image.alt = "Thumbnail.";
      groovybox_elements.groovytrack_image.style.display = "block";

      update_groovytrack_list();
    }

    function update_play_pause_icon(is_playing) {
      const icon_src = is_playing ? "icon_pause.png" : "icon_play.png";
      const icon_alt = is_playing ? "Pause" : "Play";

      groovybox_elements.groovybox_play_pause_icon.src = base_image_path + icon_src;
      groovybox_elements.groovybox_play_pause_icon.alt = icon_alt;

      groovybox_elements.groovytrack_image.classList.remove("spin");
      if (is_playing) void groovybox_elements.groovytrack_image.offsetWidth;
      if (is_playing) groovybox_elements.groovytrack_image.classList.add("spin");
      groovybox_elements.groovytrack_image.classList.toggle("paused", !is_playing);
    }

    function change_groovytrack(offset) {
      const count = filtered_groovytracks.length;
      const new_index = (current_groovytrack_index + offset + count) % count;
      load_groovytrack(new_index);

      if (groovybox_elements.groovybox_player.paused) {
        groovybox_elements.groovybox_player.play().catch(() => {});
      }
    }

    // play/pause
    groovybox_elements.groovytrack_toggle_play.onclick = (e) => {
      e.preventDefault();
      if (groovybox_elements.groovybox_player.paused) {
        groovybox_elements.groovybox_player.play();
      } else {
        groovybox_elements.groovybox_player.pause();
      }
    };

    // previous track
    groovybox_elements.previous_button.onclick = (e) => {
      e.preventDefault();
      change_groovytrack(-1);
    };

    // next track
    groovybox_elements.next_button.onclick = (e) => {
      e.preventDefault();
      change_groovytrack(1);
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
      const count = filtered_groovytracks.length;
      groovybox_elements.groovybox_total_number_of_tracks.textContent =
        `${count} track${count === 1 ? "" : "s"}`;
      groovybox_elements.groovybox_total_runtime.textContent = get_total_runtime();
    }

    show_groovybox_info();

    // make audio element unfocusable to avoid scrolling on play/pause
    groovybox_elements.groovybox_player.setAttribute("tabindex", "-1");

    load_groovytrack(current_groovytrack_index);

    window.scrollTo(0, 0);

    // volume slider
    groovybox_elements.volume_slider.addEventListener("input", () => {
      groovybox_elements.groovybox_player.volume = groovybox_elements.volume_slider.value;
    });
  });
});

function create_groovybox_HTML(wrapper) {
  if (!wrapper) return;

  const show_folders = wrapper.dataset.showFolders !== "false";

  // show folder selector unless data-show-folders equals "false"
  const folder_selector_html = show_folders ?
    `
      <select class="groovybox_folder_selector">
        <option value="general">general</option>
        <option value="TSTV">T.S.T.V. OST</option>
        <option value="SCARR">S.C.A.R.R.</option>
      </select>
    ` :
    "";

  const groovybox_wrapper = document.createElement("div");
  groovybox_wrapper.className = "groovybox_wrapper";

  groovybox_wrapper.innerHTML = `
    <div class="groovybox_main">
      <div class="groovybox_title">GROOVYBOX</div>

      ${folder_selector_html}

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
        <div class="groovytrack_volume_row">
          <label for="groovybox_volume_slider" style="color: white; font-family: 'Roboto'; font-size: 14px;">Volume</label>
          <input type="range" id="groovybox_volume_slider" min="0" max="1" step="0.01" value="1">
        </div>
      </div>
      <div class="groovytracks_info">
        <div class="groovybox_total_number_of_tracks"></div>
        <div class="groovybox_total_runtime"></div>
      </div>
    </div>
    <div class="groovytrack_list"></div>
  `;

  wrapper.appendChild(groovybox_wrapper);
}
