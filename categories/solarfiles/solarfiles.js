// ======== CONFIG ========
const user = "solarsimondm";
const repo = "SolarSimonDM";
const params = new URLSearchParams(window.location.search);
const folderParam = params.get("solarfolder");
const fileParam = params.get("solarfile");

// ======== ELEMENTS ========
const breadcrumb = document.getElementById("breadcrumb");
const container = document.getElementById("solarfiles_container");
const closeBtn = document.getElementById("closeBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");
const popupFilename = document.getElementById("popupFilename");
const searchInput = document.getElementById("fileSearch");
const sizeButtons = document.querySelectorAll("#sizeSelector button");
const message = document.getElementById("message");

// ======== STATE ========
let currentIndex = 0;
let imageList = [];
let currentSize = localStorage.getItem('thumbSize') || 'medium';

const folders = [
    { name: "hero_forge", label: "hero_forge" },
    { name: "the_scarr", label: "the_scarr" }
];

// ======== HELPER FUNCTIONS ========

// Highlight active size button
function updateSizeButtons() {
    sizeButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.size === currentSize));
}

// Apply size class to all thumbnails and items
function applyThumbnailSize() {
    document.querySelectorAll(".thumb").forEach(img => {
    img.classList.remove("thumb-small", "thumb-medium", "thumb-large");
    img.classList.add(`thumb-${currentSize}`);
    });
    document.querySelectorAll(".item").forEach(item => {
    item.classList.remove("thumb-small", "thumb-medium", "thumb-large");
    item.classList.add(`thumb-${currentSize}`);
    });
}

// Apply folder icon size and label spacing
function applyFolderSize(div) {
    const folderIcon = div.querySelector(".folder");
    const folderLabel = div.querySelector(".folder-label");
    if (!folderIcon || !folderLabel) return;

    if (currentSize === "small") {
    folderIcon.style.fontSize = "50px";
    folderLabel.style.marginTop = "5px";
    folderLabel.style.fontSize = "12px";
    } else if (currentSize === "medium") {
    folderIcon.style.fontSize = "80px";
    folderLabel.style.marginTop = "8px";
    folderLabel.style.fontSize = "14px";
    } else {
    folderIcon.style.fontSize = "120px";
    folderLabel.style.marginTop = "10px";
    folderLabel.style.fontSize = "16px";
    }
}

// Apply folder size to all top-level folders
function applyAllFolderSizes() {
    document.querySelectorAll(".item").forEach(div => {
    if (div.querySelector(".folder")) applyFolderSize(div);
    });
}

// Display top-level folders
function showFolders() {
    breadcrumb.innerHTML = `<a href="solarfiles.html">S:\</a>`;
    folders.forEach(f => {
    const div = document.createElement("div");
    div.className = "item folder-item";
    div.innerHTML = `<div class="folder">📁</div><div class="folder-label">${f.label}</div>`;
    applyFolderSize(div);
    div.addEventListener("click", () => window.location.search = `?solarfolder=${f.name}`);
    container.appendChild(div);
    });
}

// Display files inside a folder
function showFiles(folder) {
    return new Promise((resolve, reject) => {
    const folderObj = folders.find(f => f.name === folder);
    const folderLabel = folderObj ? folderObj.label : folder;
    breadcrumb.innerHTML = `<a href="solarfiles.html">S:\</a>\\<a href="?solarfolder=${folder}">${folderLabel}</a>\\`;

    const path = folder === "hero_forge" ? "media/images/hero_forge/JPG" :
        folder === "the_scarr" ? "media/images/the_scarr" :
        `media/images/${folder}`;

    fetch(`https://api.github.com/repos/${user}/${repo}/contents/${encodeURIComponent(path)}`)
        .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
        .then(data => {
        if (!Array.isArray(data) || data.length === 0) { message.textContent = `No files in ${path}`; resolve(); return; }

        imageList = [];
        container.innerHTML = "";

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "item";

            const isImage = /\.(png|jpe?g|gif|webp)$/i.test(item.name);
            if (isImage) {
            div.classList.add("image-item");
            const img = document.createElement("img");
            img.className = `thumb thumb-${currentSize}`;
            img.alt = item.name;
            img.setAttribute("data-src", item.download_url);
            div.appendChild(img);
            div.addEventListener("click", () => {
                currentIndex = imageList.findIndex(u => u === item.download_url);
                showPopupImage(currentIndex, item.name);
            });
            imageList.push(item.download_url);
            } else {
            div.innerHTML = `<div class="file-icon">📄</div>`;
            }

            const caption = document.createElement("div");
            caption.className = "caption";
            caption.textContent = item.name;
            div.appendChild(caption);

            container.appendChild(div);
        });

        // Lazy load images
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                obs.unobserve(img);
            }
            });
        });
        document.querySelectorAll("img[data-src]").forEach(img => observer.observe(img));

        applyThumbnailSize();
        resolve();
        })
        .catch(err => { message.textContent = `Error loading ${path}: ${err.message}`; reject(err); });
    });
}

// Show image popup
function showPopupImage(index, filename = null) {
    if (index < 0 || index >= imageList.length) return;
    currentIndex = index;
    popupImg.src = imageList[currentIndex];
    popupFilename.textContent = filename || imageList[currentIndex].split('/').pop();
    popup.classList.add("active");
}

// ======== EVENT LISTENERS ========

// Size button click
sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
    currentSize = btn.dataset.size;
    localStorage.setItem('thumbSize', currentSize);
    updateSizeButtons();
    applyThumbnailSize();
    applyAllFolderSizes();
    });
});

// Popup navigation buttons
prevBtn.addEventListener("click", () => showPopupImage(currentIndex - 1));
nextBtn.addEventListener("click", () => showPopupImage(currentIndex + 1));

// Popup keyboard controls
document.addEventListener("keydown", e => {
    if (!popup.classList.contains("active")) return;
    if (e.key === "ArrowLeft") showPopupImage(currentIndex - 1);
    if (e.key === "ArrowRight") showPopupImage(currentIndex + 1);
    if (e.key === "Escape") popup.classList.remove("active");
});

// Close popup
closeBtn.addEventListener("click", () => popup.classList.remove("active"));
popup.addEventListener("click", e => { if (e.target === popup) popup.classList.remove("active"); });

// File search
searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    document.querySelectorAll(".item").forEach(div => {
    const caption = div.querySelector(".caption");
    const isFolder = !!div.querySelector(".folder");
    if (term === "") div.style.display = "";
    else if (caption && caption.textContent.toLowerCase().includes(term)) div.style.display = "";
    else if (isFolder && div.querySelector(".folder-label").textContent.toLowerCase().includes(term)) div.style.display = "";
    else div.style.display = "none";
    });
});

// ======== INITIALIZE ========
updateSizeButtons();
if (!folderParam) {
    showFolders();
    applyAllFolderSizes();
} else {
    showFiles(folderParam).then(() => {
    if (fileParam) {
        const idx = imageList.findIndex(u => u.endsWith(fileParam));
        if (idx >= 0) showPopupImage(idx);
    }
    });
}