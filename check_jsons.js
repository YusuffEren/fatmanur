const fs = require('fs');
const txt = fs.readFileSync('public/wp-content/themes/fatmanur/app-fatmanur-v3.js', 'utf8');

const jsons = txt.match(/['"`][^'"`\s]+\.json['"`]/g);
if (jsons) {
    const unique = [...new Set(jsons)];
    console.log("Found JSONs:", unique.slice(0, 30));
} else {
    console.log("No JSON URLs found.");
}
