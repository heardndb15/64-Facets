/**
 * scripts/copy-stockfish.js
 *
 * Copies the Stockfish Web Worker files from node_modules into the
 * Next.js public/ directory so it can be loaded as a Web Worker.
 *
 * Run with: node scripts/copy-stockfish.js
 * Or add as a postinstall hook in package.json.
 */

const fs = require("fs");
const path = require("path");

const sources = [
  // stockfish npm package v16+
  path.resolve(__dirname, "../node_modules/stockfish/src/stockfish-nnue-16.js"),
  path.resolve(__dirname, "../node_modules/stockfish/src/stockfish-nnue-16.wasm"),
  // fallback: stockfish.js v10 (basic)
  path.resolve(__dirname, "../node_modules/stockfish/stockfish.js"),
];

const destDir = path.resolve(__dirname, "../public");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

let copied = false;
for (const src of sources) {
  if (fs.existsSync(src)) {
    const dest = path.join(destDir, path.basename(src));
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied: ${path.basename(src)} → public/`);
    copied = true;
  }
}

if (!copied) {
  console.warn(
    "⚠  Stockfish files not found in node_modules. Analysis will use mock mode.\n" +
    "   Run: npm install  then try again."
  );
} else {
  // Ensure the main entry is named stockfish.js
  const nnueFile = path.join(destDir, "stockfish-nnue-16.js");
  const basicFile = path.join(destDir, "stockfish.js");
  if (fs.existsSync(nnueFile) && !fs.existsSync(basicFile)) {
    fs.copyFileSync(nnueFile, basicFile);
    console.log("✓ Created public/stockfish.js alias");
  }

  console.log("\n✅ Stockfish ready for Web Worker usage.");
}
