const fs = require('fs');
const filePath = 'public/wp-content/themes/fatmanur/app.js';

let content = fs.readFileSync(filePath, 'utf8');

// 1. Şiir / Söz değişimleri ("paragraphs" içeren JSON payload'u yakala)
// Bu kısım çok uzun olabilir, o yüzden JSON.parse kullanarak bulmayı deneyelim.
const regex = /JSON\.parse\('(\{"width":.*?,"paragraphs":\[.*?\]\})'\)/;
const match = content.match(regex);

if (match) {
    try {
        let data = JSON.parse(match[1]);

        // Fatmanur Koru'nun biyografi paragraflarına bölelim:
        data.paragraphs = [
            ["Fatmanur Koru", "22 yaşında,", "aslen Sivaslı ama", "İstanbul'da yaşıyor.", "Evin en küçüğü,", "o yüzden biraz prenseslik var."],
            ["İstanbul Üniversitesinde", "Şehir Bölge Planlama", "okuyor.", "Yeşili, matchayı,", "broş takmayı çok seviyor."],
            ["Sivas milliyetçisi,", "arada bir", "kendini enik sanıyor.", "Avokado, suşi ve", "toplumun pek sevmediği", "şeyleri seviyor."],
            ["Yani aslında ben de", "daha yeni yeni tanıdığım için", "buraya detaylı bilgileri", "ilerleyen zamanlarda", "yüklemeye devam edeceğim."],
            ["(Bana soyadını bile söylemedi,", "ben kendisini ve", "Madımak faili dedesini buldum.)"]
        ];

        // Yeni JSON'ı string'e çevir
        const newJsonStr = JSON.stringify(data);

        // Değiştir
        content = content.replace(match[0], `JSON.parse('${newJsonStr}')`);
        console.log("✅ Paragraf JSON verisi başarıyla güncellendi.");
    } catch (e) {
        console.error("JSON parse hatası: ", e);
    }
} else {
    console.log("❌ JSON payload bulunamadı!");
}

// 2. Ayrıca "David Whyte" vs. adlarının geçtiği diğer yerleri bulalım
let count = 0;
content = content.replace(/David Whyte/g, (match) => { count++; return "Fatmanur Koru"; });
console.log(`✅ "David Whyte" -> "Fatmanur Koru" (${count} değişiklik)`);

count = 0;
content = content.replace(/David's/g, (match) => { count++; return "Fatmanur'un"; });
console.log(`✅ "David's" -> "Fatmanur'un" (${count} değişiklik)`);

// "You start" varsa direkt sil vs string değişimleri yap
count = 0;
content = content.replace(/You start/g, (match) => { count++; return "Fatmanur Koru"; });
console.log(`✅ "You start" -> "Fatmanur Koru" (${count} değişiklik)`);

// Dosyayı kaydet
fs.writeFileSync(filePath, content, 'utf8');
console.log("🎉 Dosya kaydedildi: " + filePath);
