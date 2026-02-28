const fs = require('fs');
const txt = fs.readFileSync('public/wp-content/themes/fatmanur/app-fatmanur-v3.js', 'utf8');

const urls = txt.match(/https?:\/\/[^\s"'`)]+/g);
if (urls) {
    const uniqueUrls = [...new Set(urls)];
    console.log("Found URLs:", uniqueUrls.slice(0, 20)); // show first 20
} else {
    console.log("No URLs found.");
}
