/**
 * KALICI METİN DEĞİŞTİRME SİSTEMİ v3
 * =====================================
 * Bu script:
 * 1. fetch() API'sini intercept ederek API yanıtlarındaki metinleri değiştirir
 * 2. DOM'u MutationObserver ile izleyerek app.js'nin enjekte ettiği metinleri yakalar
 * 3. Satır sonu karakterlerini normalize ederek eşleştirme yapar
 */

const BIO_TEXT = `Fatmanur Koru 22 yaşında, aslen Sivaslı ama İstanbul'da yaşıyor. Evin en küçüğü, o yüzden biraz prenseslik var. İstanbul Üniversitesinde Şehir Bölge Planlama okuyor. Yeşili, matchayı, broş takmayı çok seviyor. Sivas milliyetçisi, arada bir kendini enik sanıyor. Avokado, suşi ve toplumun genelinin pek sevmediği diğer şeyleri çok seviyor. En sevdiği kelimelerden biri "deneyimmmm" (en az birkaç m ile). Yani aslında ben de daha yeni yeni tanıdığım için buraya detaylı bilgileri ilerleyen zamanlarda yüklemeye devam edeceğim. (Bana soyadını bile söylemedi, ben kendisini ve Madımak faili dedesini buldum.)`;

// ===== FETCH INTERCEPTION =====
// app.js'nin WordPress API'den aldığı tüm yanıtlardaki metinleri değiştirir

const originalFetch = window.fetch;
window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);

    try {
        const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');

        // WordPress API ve sayfa içerik isteklerini intercept et
        if (url.includes('wp-json') || url.includes('wp-admin') ||
            url.includes('experience') || url.includes('page') ||
            url.includes('.json') || url.includes('api')) {

            const clone = response.clone();
            const text = await clone.text();

            // Metinde değişiklik yapılması gerekiyorsa
            if (text.includes('You start') || text.includes('painter') ||
                text.includes('David Whyte') || text.includes('David')) {

                let modified = text;
                // "You start with a painter's hand..." şiirini biyografiyle değiştir
                modified = modified.replace(/You start[\s\S]*?Painter['']s Hand['""\)"]*/gi, BIO_TEXT);
                modified = modified.replace(/You start[\s\S]*?remembrance[\s\S]*?\)/gi, BIO_TEXT);
                modified = modified.replace(/David Whyte/g, 'Fatmanur Koru');
                modified = modified.replace(/David's/g, "Fatmanur'un");

                // Yeni Response oluştur
                return new Response(modified, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }
        }
    } catch (e) {
        // Hata olursa orijinal yanıtı dön
    }

    return response;
};

// ===== XMLHttpRequest INTERCEPTION =====
const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._interceptUrl = url;
    return originalXHROpen.call(this, method, url, ...rest);
};

XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener('readystatechange', function () {
        if (this.readyState === 4 && this._interceptUrl) {
            try {
                const text = this.responseText;
                if (text && (text.includes('You start') || text.includes('painter') || text.includes('David'))) {
                    let modified = text;
                    modified = modified.replace(/You start[\s\S]*?Painter['']s Hand['""\)"]*/gi, BIO_TEXT);
                    modified = modified.replace(/You start[\s\S]*?remembrance[\s\S]*?\)/gi, BIO_TEXT);
                    modified = modified.replace(/David Whyte/g, 'Fatmanur Koru');

                    Object.defineProperty(this, 'responseText', { value: modified, writable: false });
                    Object.defineProperty(this, 'response', { value: modified, writable: false });
                }
            } catch (e) { }
        }
    });
    return originalXHRSend.apply(this, args);
};

// ===== DOM SCANNING =====
function scanAndReplace(root) {
    if (!root || !root.querySelectorAll) return;

    // Tüm text node'ları tara
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToReplace = [];

    while (node = walker.nextNode()) {
        const text = node.textContent;
        if (!text) continue;

        // Normalize: satır sonlarını ve fazla boşlukları temizle
        const normalized = text.replace(/\s+/g, ' ').trim().toLowerCase();

        // "You start" ile başlayan metinleri bul
        if (normalized.includes('you start') &&
            (normalized.includes('painter') || normalized.includes('working') || normalized.includes('color') || normalized.includes('palette'))) {
            nodesToReplace.push(node);
        }
    }

    // Bulunan node'ların parent elementlerini değiştir
    const replacedParents = new Set();
    nodesToReplace.forEach(node => {
        let target = node.parentElement;
        // En yakın anlamlı container'ı bul
        while (target && target.children.length === 0 && target.parentElement) {
            target = target.parentElement;
        }

        if (target && !replacedParents.has(target)) {
            replacedParents.add(target);
            // Sadece şiir metnini içeren kısmı değiştir
            const parent = target.closest('.xp-text') || target.closest('.gmail_default') || target;
            if (parent && !replacedParents.has(parent)) {
                replacedParents.add(parent);
                parent.innerHTML = `<div class="gmail_default">${BIO_TEXT}</div>`;
            }
        }
    });

    // Ayrıca tüm elementlerin textContent'ini kontrol et
    const allElements = root.querySelectorAll('div, p, span, section');
    allElements.forEach(el => {
        const text = el.textContent.replace(/\s+/g, ' ').trim().toLowerCase();

        if (text.startsWith('you start') && text.includes('painter') && el.children.length <= 2) {
            if (!replacedParents.has(el)) {
                el.innerHTML = BIO_TEXT;
                replacedParents.add(el);
            }
        }
    });
}

// ===== MutationObserver =====
let observer = null;
let debounceTimer = null;

function debouncedScan() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (observer) observer.disconnect();
        scanAndReplace(document.body);
        if (observer) {
            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
    }, 100);
}

function init() {
    scanAndReplace(document.body);

    observer = new MutationObserver(() => debouncedScan());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // Periyodik tarama
    [200, 500, 1000, 1500, 2000, 3000, 5000, 8000, 12000, 15000, 20000].forEach(
        ms => setTimeout(() => scanAndReplace(document.body), ms)
    );
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
