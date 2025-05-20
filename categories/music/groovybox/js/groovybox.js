// Introducing the Groovybox player, the player to get all other players out of business or something.

let current_groovytrack_index = 0;

const groovybox_elements = {
  groovybox_player: document.getElementById("groovybox_player"),
  groovytrack_list: document.getElementById("groovytrack_list"),
  groovytrack_image: document.getElementById("groovytrack_image"),
  groovytrack_progress_bar: document.getElementById("groovytrack_progress_bar"),
  groovytrack_current_time: document.getElementById("groovytrack_current_time"),
  groovytrack_duration_time: document.getElementById("groovytrack_duration_time"),
  groovytrack_toggle_play: document.getElementById("groovybox_toggle_play"),
  groovybox_play_pause_icon: document.getElementById("groovybox_play_pause_icon"),
  groovybox_total_number_of_tracks: document.getElementById("groovybox_total_number_of_tracks"),
  groovybox_total_runtime: document.getElementById("groovybox_total_runtime")
};

// turn seconds into minutes:seconds
function seconds_to_minutes(time){
    return Math.floor(time / 60)+':'+ ('0' + Math.floor(time % 60)).slice(-2)
};

// get total duration of all tracks from the property "duration" of the groovytracks_array
function get_total_runtime() {
  let total_seconds = 0;

  for (const track of groovytracks_array) {
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
  groovybox_elements.groovytrack_list.innerHTML = "<ul id='groovytrack_ul'></ul>";
  const ul = document.getElementById("groovytrack_ul");

  groovytracks_array.forEach((groovytrack, index) => {
    const li = document.createElement("li");
    li.textContent = `${groovytrack.name} (${groovytrack.duration})`;
    if (index === current_groovytrack_index) li.classList.add("current");
    li.onclick = () => load_groovytrack(index);
    ul.appendChild(li);
  });

  const current_li = ul.querySelector("li.current");
  if (current_li) current_li.scrollIntoView({ behavior: "auto", block: "start" });
}

// load track, track image
function load_groovytrack(index) {
  current_groovytrack_index = index;
  const groovytrack = groovytracks_array[index];

  groovybox_elements.groovybox_player.src = groovytrack.file;
  groovybox_elements.groovybox_player.load();
  groovybox_elements.groovybox_player.play();

  groovybox_elements.groovytrack_image.src = groovytrack.image || "images/squirrel_GIF.gif";
  groovybox_elements.groovytrack_image.alt = "Thumbnail.";
  groovybox_elements.groovytrack_image.style.display = "block";

  update_groovytrack_list();
}

// if .onplay, show pause icon
function update_play_pause_icon(is_playing) {
  groovybox_elements.groovybox_play_pause_icon.src = is_playing ? "images/icon_pause.png" : "images/icon_play.png";
  groovybox_elements.groovybox_play_pause_icon.alt = is_playing ? "Pause" : "Play";

  // restart spin animation if track plays, if not stop animation
  groovybox_elements.groovytrack_image.classList.remove("spin");
  if (is_playing) void groovybox_elements.groovytrack_image.offsetWidth;
  if (is_playing) groovybox_elements.groovytrack_image.classList.add("spin");
  groovybox_elements.groovytrack_image.classList.toggle("paused", !is_playing);
}

// change track logic
function change_groovytrack(offset) {
  const count = groovytracks_array.length;
  const new_index = (current_groovytrack_index + offset + count) % count;
  load_groovytrack(new_index);
}

// play/pause track
groovybox_elements.groovytrack_toggle_play.onclick = () =>
  groovybox_elements.groovybox_player.paused ? groovybox_elements.groovybox_player.play() : groovybox_elements.groovybox_player.pause();

// change to previous track
document.getElementById("previous_groovytrack").onclick = () => change_groovytrack(-1);

// change to next track
document.getElementById("next_groovytrack").onclick = () => change_groovytrack(1);

// change to next track if track ended
groovybox_elements.groovybox_player.onended = () => change_groovytrack(1);

// if track plays set the function to true
groovybox_elements.groovybox_player.onplay = () => update_play_pause_icon(true);
groovybox_elements.groovybox_player.onpause = () => update_play_pause_icon(false);

// show track duration
groovybox_elements.groovybox_player.onloadedmetadata = () => {
  groovybox_elements.groovytrack_duration_time.textContent = seconds_to_minutes(groovybox_elements.groovybox_player.duration);
};

// show current time by calculating progress percentage
groovybox_elements.groovybox_player.ontimeupdate = () => {
  const cur = groovybox_elements.groovybox_player.currentTime;
  const dur = groovybox_elements.groovybox_player.duration || 1; // prevent dividing by 0
  groovybox_elements.groovytrack_progress_bar.value = (cur / dur) * 100;
  groovybox_elements.groovytrack_current_time.textContent = seconds_to_minutes(cur);
};

// update playback position when user changes slider position
groovybox_elements.groovytrack_progress_bar.oninput = () => {
  groovybox_elements.groovybox_player.currentTime = (groovybox_elements.groovytrack_progress_bar.value / 100) * groovybox_elements.groovybox_player.duration;
};

function show_groovybox_info () {
// show total number of tracks
groovybox_elements.groovybox_total_number_of_tracks.textContent = `${groovytracks_array.length} tracks`;
// show the total duration of tracks you got from the get_total_runtime function
groovybox_elements.groovybox_total_runtime.textContent = `${get_total_runtime()}`;
};

show_groovybox_info();

load_groovytrack(current_groovytrack_index);