const fs = require('fs');

const path = 'public/wp-content/themes/fatmanur/app.js';
let content = fs.readFileSync(path, 'utf8');

const paragraphsTarget = `JSON.parse('{"width":400,"height":2304,"fontSize":"30px","lineHeight":48,"paragraphs":[["You start","with a painter’s hand","working up color","from a dark palette","of remembrance","(from “The Painter’s Hand”)"],["What you can plan","is too small","for you to live."],["What you can live","wholeheartedly","will make plans","enough","for the vitality","hidden in your sleep.","(from “What to Remember When Waking”)"],["You must learn one thing.","The world was made to be free in.\\n","Give up all the other worlds","except the one to which you belong.","(from “Sweet Darkness”)"]]}')`;

// Yeni metnimiz
const newContent = `JSON.parse('{"width":400,"height":2304,"fontSize":"30px","lineHeight":48,"paragraphs":[["Fatmanur Koru","22 yaşında,","aslen Sivaslı ama","İstanbul\\'da yaşıyor.","Evin en küçüğü,","o yüzden biraz prenseslik var."],["İstanbul Üniversitesinde","Şehir Bölge Planlama","okuyor."],["Yeşili, matchayı,","broş takmayı","çok seviyor."],["Sivas milliyetçisi,","kendini enik sanıyor.","Avokado ve suşi","toplumun sevmediği","şeyleri çok seviyor."],["En sevdiği kelimelerden biri","\\\"deneyimmmm\\\"","(en az birkaç m ile)."],["Yani aslında","daha yeni yeni tanıdığım için","buraya detaylı bilgileri","ilerleyen zamanlarda","yüklemeye devam edeceğim."],["(Bana soyadını bile söylemedi,","ben kendisini ve","Madımak faili dedesini buldum.)"]]}')`;

if (content.includes(paragraphsTarget)) {
    content = content.replace(paragraphsTarget, newContent);
    console.log("✅ Şiir paragrafları başarıyla değiştirildi!");
} else {
    console.log("❌ Paragraf target bulunamadı. Belki formatı farklıdır, arıyorum...");

    // Regex ile arayalım:
    const regex = /JSON\.parse\('\{"width":400,"height":2304[^}]+\}'\)/;
    if (regex.test(content)) {
        content = content.replace(regex, newContent);
        console.log("✅ Paragraflar Regex ile değiştirildi!");
    }
}

// "David Whyte" vs. içeren diğer yerleri de metin olarak güvenle değiştirelim
const replacements = [
    { target: "David Whyte", replacement: "Fatmanur Koru" },
    { target: "David's", replacement: "Fatmanur'un" },
    { target: "You start", replacement: "Fatmanur Koru" }
];

replacements.forEach(({ target, replacement }) => {
    let count = 0;
    while (content.includes(target)) {
        content = content.replace(target, replacement);
        count++;
    }
    console.log(`✅ Detay metni: "${target}" -> "${replacement}" (${count} kez)`);
});

fs.writeFileSync(path, content, 'utf8');
console.log("İşlem tamamlandı, app.js güncellendi.");
