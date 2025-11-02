// ======== CONFIG ========
const params = new URLSearchParams(window.location.search);
const folderParam = params.get("solarfolder");
const fileParam = params.get("solarfile");

const indexFile = "solarfiles_index_build.json";
let solarfilesIndex = {};

let currentAudio = null; 

// ======== ELEMENTS ========
const breadcrumb = document.getElementById("breadcrumb");
const container = document.getElementById("solarfiles_container");
const closeBtn = document.getElementById("closeBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const popup = document.getElementById("popup");
const popupMedia = document.getElementById("popupMedia");
const popupFilename = document.getElementById("popupFilename");
const searchInput = document.getElementById("fileSearch");
const sizeButtons = document.querySelectorAll("#sizeSelector button");
const message = document.getElementById("message");

// ======== STATE ========
let currentIndex = 0;
let mediaList = [];
let filteredMediaList = [];
let currentSize = localStorage.getItem('thumbSize') || 'medium';
let lastScroll = parseInt(localStorage.getItem('scrollPos')) || 0;

// ======== HELPER FUNCTIONS ========
function updateSizeButtons() {
    sizeButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.size === currentSize));
}

function applyThumbnailSize() {
    document.querySelectorAll(".item").forEach(el => {
        el.classList.remove("thumb-small", "thumb-medium", "thumb-large");
        el.classList.add(`thumb-${currentSize}`);
    });
    document.querySelectorAll(".thumb").forEach(el => {
        el.classList.remove("thumb-small", "thumb-medium", "thumb-large");
        el.classList.add(`thumb-${currentSize}`);
    });
}

// ======== DISPLAY FUNCTIONS ========
function showBreadcrumb(pathArray) {
    breadcrumb.innerHTML = `<a href="solarfiles.html">S:\\</a>`;
    pathArray.forEach((part, i) => {
        breadcrumb.innerHTML += `\\<a href="?solarfolder=${pathArray.slice(0, i+1).join('/')}">${part}</a>`;
    });
}

function showFoldersAndFiles(folderData, pathArray = []) {
    container.innerHTML = "";
    mediaList = [];

    const folders = Object.keys(folderData).filter(k => k !== "files");
    const files = folderData.files || [];

    folders.forEach(key => {
        const div = document.createElement("div");
        div.className = "item folder-item";
        div.innerHTML = `<div class="folder">📁</div><div class="folder-label">${key}</div>`;
        div.addEventListener("click", () => {
            const newPath = [...pathArray, key];
            history.pushState(null, '', `?solarfolder=${newPath.join('/')}`);
            showFoldersAndFiles(folderData[key], newPath);
            showBreadcrumb(newPath);
        });
        container.appendChild(div);
    });

    files.forEach(url => {
        const filename = url.split('/').pop();
        const ext = filename.split('.').pop().toLowerCase();
        const div = document.createElement("div");
        div.className = "item image-item";

        div.addEventListener("click", () => {
            const idx = (filteredMediaList.length ? filteredMediaList : mediaList)
                        .findIndex(m => m.filename === filename);
            showPopupMedia(idx);
        });

        let mediaEl;
        if (/(png|jpe?g|gif|webp|bmp|tiff|svg)/i.test(ext)) {
            mediaEl = document.createElement("img");
            mediaEl.setAttribute("data-src", url);
        } else if (/(mp3|wav|ogg|flac|m4a)/i.test(ext)) {
            mediaEl = document.createElement("img");
            mediaEl.src = "../../media/images/Tom_Grooves_CD.png";
            mediaEl.className = `thumb thumb-${currentSize}`;
        } else if (/(mp4|mov|avi|mkv|webm)/i.test(ext)) {
            mediaEl = document.createElement("video");
            mediaEl.setAttribute("data-src", url);
        }
        if (!mediaEl) return;

        mediaEl.className = `thumb thumb-${currentSize}`;
        div.appendChild(mediaEl);

        const caption = document.createElement("div");
        caption.className = "caption";
        caption.textContent = filename;
        div.appendChild(caption);
        container.appendChild(div);

        mediaList.push({ url, type: ext, filename });
    });

    // Lazy-load all media
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const src = el.dataset.src;
                if (src) {
                    el.src = src;
                    obs.unobserve(el);
                }
            }
        });
    });
    document.querySelectorAll("img[data-src], audio[data-src], video[data-src]").forEach(el => observer.observe(el));

    applyThumbnailSize();

    // Restore scroll
    window.scrollTo(0, lastScroll);
}

// ======== POPUP ========
function showPopupMedia(index, filename = null) {
    const list = filteredMediaList.length ? filteredMediaList : mediaList;
    if (!list.length) return;

    if (index < 0) index = list.length - 1;
    if (index >= list.length) index = 0;
    currentIndex = index;

    const item = list[currentIndex];

    // Update URL with ?solarfile=filename while preserving folder
    const params = new URLSearchParams(window.location.search);
    params.set("solarfile", item.filename);
    history.replaceState(null, "", `?${params.toString()}`);

    // Stop any previous media
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }

    popupMedia.innerHTML = "";

    if (/(png|jpe?g|gif|webp|bmp|tiff|svg)/i.test(item.type)) {
        const img = document.createElement("img");
        img.src = item.url;
        popupMedia.appendChild(img);
    } else if (/(mp3|wav|ogg|flac|m4a)/i.test(item.type)) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.autoplay = true;
        audio.src = item.url;
        audio.style.marginTop = "10px";
        popupMedia.appendChild(audio);
        currentAudio = audio;
    } else if (/(mp4|mov|avi|mkv|webm)/i.test(item.type)) {
        const video = document.createElement("video");
        video.controls = true;
        video.autoplay = true;
        video.src = item.url;
        popupMedia.appendChild(video);
        currentAudio = video; // track video for stopping on close
    }

    popupFilename.textContent = filename || item.filename;
    popup.classList.add("active");
}

// ======== EVENT LISTENERS ========
sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentSize = btn.dataset.size;
        localStorage.setItem('thumbSize', currentSize);
        updateSizeButtons();
        applyThumbnailSize();
    });
});

prevBtn.addEventListener("click", () => showPopupMedia(currentIndex - 1));
nextBtn.addEventListener("click", () => showPopupMedia(currentIndex + 1));

document.addEventListener("keydown", e => {
    if (!popup.classList.contains("active")) return;
    if (e.key === "ArrowLeft") showPopupMedia(currentIndex - 1);
    if (e.key === "ArrowRight") showPopupMedia(currentIndex + 1);
    if (e.key === "Escape") popup.classList.remove("active");
});

function closePopup() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    popup.classList.remove("active");
}

closeBtn.addEventListener("click", closePopup);
popup.addEventListener("click", e => { 
    if (e.target === popup) closePopup(); 
});

// ======== SEARCH ========
searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    filteredMediaList = [];

    document.querySelectorAll(".item").forEach(div => {
        const caption = div.querySelector(".caption");
        const folderLabel = div.querySelector(".folder-label");
        let isVisible = false;

        if (term === "") isVisible = true;
        else if (caption && caption.textContent.toLowerCase().includes(term)) isVisible = true;
        else if (folderLabel && folderLabel.textContent.toLowerCase().includes(term)) isVisible = true;

        div.style.display = isVisible ? "" : "none";

        if (isVisible && caption) {
            const item = mediaList.find(m => m.filename === caption.textContent);
            if (item) filteredMediaList.push(item);
        }
    });

    currentIndex = 0;
});

// ======== SCROLL SAVE ========
window.addEventListener("scroll", () => {
    localStorage.setItem('scrollPos', window.scrollY);
});

// ======== INITIALIZE ========
fetch(indexFile)
    .then(res => res.json())
    .then(data => {
        solarfilesIndex = data;
        updateSizeButtons();

        let folderData = solarfilesIndex;
        const pathArray = folderParam ? folderParam.split('/') : [];

        pathArray.forEach(p => folderData = folderData[p] || folderData);

        showFoldersAndFiles(folderData, pathArray);
        showBreadcrumb(pathArray);

        // If fileParam exists, open popup
        if (fileParam) {
            const list = mediaList;
            const idx = list.findIndex(m => m.filename === fileParam);
            if (idx >= 0) showPopupMedia(idx, fileParam);
        }
    })
    .catch(err => {
        message.textContent = `Error loading ${indexFile}: ${err.message}`;
    });

// ======== SAVE HISTORY CORRECTLY ========
window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    const folderParam = params.get("solarfolder");
    const fileParam = params.get("solarfile");

    if (!folderParam) {
        showFoldersAndFiles(solarfilesIndex);
        showBreadcrumb([]);
        filteredMediaList = [];
        currentIndex = 0;
    } else {
        const pathArray = folderParam.split('/');
        let folderData = solarfilesIndex;
        pathArray.forEach(p => { folderData = folderData[p]; });
        showFoldersAndFiles(folderData, pathArray);
        showBreadcrumb(pathArray);

        if (fileParam) {
            const list = filteredMediaList.length ? filteredMediaList : mediaList;
            const idx = list.findIndex(m => m.filename === fileParam);
            if (idx >= 0) showPopupMedia(idx, fileParam);
        } else {
            popup.classList.remove("active");
        }
    }
});
