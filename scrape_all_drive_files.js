import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const subfolders = [
  { name: "ADIDAS", id: "1-BjFbOl9nAegY90RnztkhPVxLYXpHV5r" },
  { name: "ASCIS / OUCLOUT", id: "1cjr0PEYa54TMzqzy-mKGh3iGw08SEFA-" },
  { name: "BALONCESTO", id: "1-ASJ2H5CArgbGhnfp122gCPuCP4MlyDo" },
  { name: "EUROPEO", id: "1-2H_f-Ncr2KN7rQBi8EjcyZET3iv-ubQ" },
  { name: "JORDAN", id: "1-Frj-PtErf3EGrSwDYahK0VlEoQoOo-Q" },
  { name: "NEW BALANCE", id: "1-Ci0pRrm26o8x9q2RwO8LpJ2wzICXAKr" },
  { name: "NIKE", id: "1-24eOvIrBgFbO-IPzMXEAXwrSvO5OexW" },
  { name: "NIÑOS \uD83C\uDF6D", id: "1HwKMXfsEBpQIxYuaJpCFtRC1JYIlPYnW" },
  { name: "PUMA", id: "1-IDcXvmQ89M0nO7oXp7x30MYKDvLe8BM" },
  { name: "REEBOK", id: "1-Q8eWRAIXLQmXXMuUC_fXpeBg6djMw9i" },
  { name: "SKECHERS", id: "1-YCTYjfBLokuU5sD0Ba86df9CXtCQ6e9" },
  { name: "UNDER / TIMBERLAND", id: "10W-eonSXh_JpnupoA1D6KcttPFMJcVLo" }
];

async function scanFolder(folder) {
  console.log(`Scanning "${folder.name}" (${folder.id})...`);
  try {
    const url = `https://drive.google.com/drive/folders/${folder.id}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
      }
    });
    const html = await res.text();
    
    // Regex matching
    const idRegex = /data-id="(1[a-zA-Z0-9_-]{32})"/g;
    const idsWithIndices = [];
    let match;
    while ((match = idRegex.exec(html)) !== null) {
      if (match[1] !== folder.id) {
        idsWithIndices.push({ id: match[1], index: match.index });
      }
    }
    
    const fileEntries = [];
    const seenIds = new Set();
    
    for (let i = 0; i < idsWithIndices.length; i++) {
      const currentId = idsWithIndices[i];
      const nextIdIndex = i + 1 < idsWithIndices.length ? idsWithIndices[i+1].index : html.length;
      
      const snippet = html.substring(currentId.index, nextIdIndex);
      const ariaMatch = snippet.match(/aria-label="([^"]+)"/);
      if (ariaMatch) {
        const fullLabel = ariaMatch[1];
        
        // Match files with ending extensions
        const fileMatch = fullLabel.match(/^(.+?\.(?:jpg|jpeg|png|webp|gif|json|png|svg|glb|mp4|mov))/i);
        if (fileMatch) {
          const name = fileMatch[1];
          if (!seenIds.has(currentId.id)) {
            seenIds.add(currentId.id);
            fileEntries.push({ id: currentId.id, name });
          }
        }
      }
    }
    
    console.log(`  -> Found ${fileEntries.length} verified image files in "${folder.name}".`);
    return fileEntries;
  } catch (err) {
    console.error(`  -> Failed to scan folder ${folder.name}:`, err.message);
    return [];
  }
}

async function run() {
  const allImages = [];
  
  for (const folder of subfolders) {
    const files = await scanFolder(folder);
    for (const file of files) {
      allImages.push({
        id: file.id,
        name: file.name,
        brand: folder.name,
        url: `https://lh3.googleusercontent.com/d/${file.id}`
      });
    }
  }
  
  console.log(`\nScan Complete. Extracted ${allImages.length} images in total.`);
  
  const destPath = path.join(process.cwd(), "src", "drive_images.json");
  fs.writeFileSync(destPath, JSON.stringify(allImages, null, 2), "utf8");
  console.log(`Saved output to ${destPath}`);
}

run();
