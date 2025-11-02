const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, "../../media");
const outputFile = path.resolve(__dirname, "solarfiles_index_build.json");

// Supported file types
const fileTypes = /\.(png|jpe?g|gif|webp|bmp|tiff|svg|mp3|wav|ogg|flac|m4a|mp4|mov|avi|mkv|webm)$/i;

// Recursively scan folder and return nested structure
function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const folderData = {};

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      const subTree = scanDir(fullPath);
      if (Object.keys(subTree).length > 0) folderData[entry.name] = subTree;
    } else if (fileTypes.test(entry.name)) {
      if (!folderData.files) folderData.files = [];
      folderData.files.push(`../../media/${relPath}`);
    }
  });

  return folderData;
}

// Build index for top-level folders
const result = {};
fs.readdirSync(baseDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .forEach(folder => {
    const folderPath = path.join(baseDir, folder.name);
    result[folder.name] = scanDir(folderPath);
  });

// Save JSON
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
console.log(`✅ Updated ${outputFile}`);
