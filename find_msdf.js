const fs = require('fs');
const txt = fs.readFileSync('public/wp-content/themes/fatmanur/app-fatmanur-v3.js', 'utf8');
const matches = txt.match(/\/xp\/msdf\/[^"']+/g);
if (matches) {
    const unique = [...new Set(matches)];
    console.log(unique);
} else {
    console.log("No MSDF fonts found");
}
