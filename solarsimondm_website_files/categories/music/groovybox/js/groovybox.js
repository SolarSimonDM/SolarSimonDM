let current_groovytrack_index = 0;

const get_el = id => document.getElementById(id);

const elements = {
  player: get_el("groovybox_player"),
  list: get_el("groovytrack_list"),
  image: get_el("groovytrack_image"),
  progress: get_el("groovytrack_progress_bar"),
  time: get_el("groovytrack_current_time"),
  duration: get_el("groovytrack_duration_time"),
  toggle: get_el("groovybox_toggle_play"),
  icon: get_el("groovybox_play_pause_icon"),
  total: get_el("groovybox_total_runtime")
};

const format_time = seconds => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
};

const get_total_runtime = () =>
  format_time(
    groovytracks.reduce((sum, t) =>
      sum + t.duration.trim().split(":").reduce((m, s) => m * 60 + +s), 0)
  );
  
function update_groovytrack_list() {
  elements.list.innerHTML = "<ul id='groovytrack_ul'></ul>";
  const ul = get_el("groovytrack_ul");

  groovytracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.textContent = `${track.name} (${track.duration})`;
    if (index === current_groovytrack_index) li.classList.add("current");
    li.onclick = () => load_groovytrack(index);
    ul.appendChild(li);
  });

  const current_li = ul.querySelector("li.current");
  if (current_li) current_li.scrollIntoView({ behavior: "auto", block: "start" });
}

function load_groovytrack(index) {
  current_groovytrack_index = index;
  const track = groovytracks[index];

  elements.player.src = track.file;
  elements.player.load();
  elements.player.play();

  elements.image.src = track.image || "images/squirrel_GIF.gif";
  elements.image.alt = "Thumbnail.";
  elements.image.style.display = "block";

  update_groovytrack_list();
}

function update_play_pause_icon(is_playing) {
  elements.icon.src = is_playing ? "images/icon_pause.png" : "images/icon_play.png";
  elements.icon.alt = is_playing ? "Pause" : "Play";

  if (is_playing) {
    elements.image.classList.remove("spin");
    void elements.image.offsetWidth;
    elements.image.classList.add("spin");
  } else {
    elements.image.classList.remove("spin");
  }

  elements.image.classList.toggle("paused", !is_playing);
}

function change_groovytrack(offset) {
  const count = groovytracks.length;
  const new_index = (current_groovytrack_index + offset + count) % count;
  load_groovytrack(new_index);
}

elements.toggle.onclick = () =>
  elements.player.paused ? elements.player.play() : elements.player.pause();

get_el("previous_groovytrack").onclick = () => change_groovytrack(-1);
get_el("next_groovytrack").onclick = () => change_groovytrack(1);

elements.player.onended = () => change_groovytrack(1);
elements.player.onplay = () => update_play_pause_icon(true);
elements.player.onpause = () => update_play_pause_icon(false);

elements.player.onloadedmetadata = () => {
  elements.duration.textContent = format_time(elements.player.duration);
};

elements.player.ontimeupdate = () => {
  const cur = elements.player.currentTime;
  const dur = elements.player.duration;
  if (dur) elements.progress.value = (cur / dur) * 100;
  elements.time.textContent = format_time(cur);
};

elements.progress.oninput = () => {
  elements.player.currentTime = (elements.progress.value / 100) * elements.player.duration;
};

elements.total.textContent = `Total runtime: ${get_total_runtime()}`;
load_groovytrack(current_groovytrack_index);