// Red Letters functionality for SUNBIBLE

// IPFS Gateway URL for red letters data
const RED_LETTERS_IPFS_URL = 'https://w3s.link/ipfs/bafybeicccsyr727druhqp2i3rseucgfpfa2qjcompafdwx54n4k37cthj4';

// Books that have red letters
const RED_LETTER_BOOKS = ['Matthew', 'Mark', 'Luke', 'John', '1Corinthians', 'Revelation'];

// IndexedDB setup
const RED_LETTERS_DB_NAME = 'sunbible_red_letters';
const RED_LETTERS_STORE_NAME = 'red_letter_ids';
let redLettersDb;

// Initialize IndexedDB and start background data loading
async function initRedLettersDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(RED_LETTERS_DB_NAME, 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            redLettersDb = request.result;
            resolve();
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(RED_LETTERS_STORE_NAME)) {
                db.createObjectStore(RED_LETTERS_STORE_NAME, { keyPath: 'book' });
            }
        };
    });
}

// Fetch red letter data for a specific book
async function fetchRedLetterData(book) {
    try {
        const response = await fetch(`${RED_LETTERS_IPFS_URL}/${book === '1Corinthians' ? '1Corinthians' : book.toLowerCase()}-red-letter-ids.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        await saveRedLetterData(book, data);
        return data;
    } catch (error) {
        console.error(`Error fetching red letter data for ${book}:`, error);
        return null;
    }
}

// Save red letter data to IndexedDB
async function saveRedLetterData(book, data) {
    return new Promise((resolve, reject) => {
        const transaction = redLettersDb.transaction([RED_LETTERS_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(RED_LETTERS_STORE_NAME);

        const request = store.put({ book, data });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Get red letter data from IndexedDB
async function getRedLetterData(book) {
    return new Promise((resolve, reject) => {
        const transaction = redLettersDb.transaction([RED_LETTERS_STORE_NAME], 'readonly');
        const store = transaction.objectStore(RED_LETTERS_STORE_NAME);

        const request = store.get(book);

        request.onsuccess = () => resolve(request.result?.data || null);
        request.onerror = () => reject(request.error);
    });
}

// Apply red letters to a chapter
async function applyRedLetters(book, chapterNum, chapterElement) {
    if (!RED_LETTER_BOOKS.includes(book)) return;

    try {
        // Get or fetch red letter data
        let redLetterData = await getRedLetterData(book);
        if (!redLetterData) {
            redLetterData = await fetchRedLetterData(book);
            if (!redLetterData) return;
        }

        // Find the chapter data
        const chapterData = redLetterData[book].find(ch => ch.chapter === String(chapterNum));
        if (!chapterData) return;

        // Process each verse with red letters
        chapterData.verses.forEach(verseData => {
            const verseElements = chapterElement.getElementsByClassName('bible_book_chapter_verse');
            const verseElement = Array.from(verseElements).find(el => {
                const verseNumber = el.querySelector('.verse_number');
                return verseNumber && verseNumber.textContent === verseData.verse;
            });
            if (!verseElement) return;

            const verseText = verseElement.querySelector('.verse_text');
            if (!verseText) return;

            const words = verseText.textContent.split(' ');
            const wordIds = verseData.word_ids.split('-').map(Number);
            const [start, end] = wordIds;

            // Wrap the red letter words in a span
            const beforeWords = words.slice(0, start - 1).join(' ');
            const redWords = words.slice(start - 1, end).join(' ');
            const afterWords = words.slice(end).join(' ');

            verseText.innerHTML = `${beforeWords} <span class="red-letters">${redWords}</span> ${afterWords}`.trim();
        });
    } catch (error) {
        console.error('Error applying red letters:', error);
    }
}

// Initialize database and start background downloads
async function initializeRedLetters() {
    try {
        await initRedLettersDb();
        // Start background downloads for all red letter books
        RED_LETTER_BOOKS.forEach(book => {
            getRedLetterData(book).then(data => {
                if (!data) fetchRedLetterData(book);
            });
        });
    } catch (error) {
        console.error('Error initializing red letters:', error);
    }
}

// Watch for Bible content changes and apply red letters
function watchForBibleChanges() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                const chapterElement = mutation.target.closest('[data-chapter]');
                if (chapterElement) {
                    const book = chapterElement.getAttribute('data-book');
                    const chapter = chapterElement.getAttribute('data-chapter');
                    if (book && chapter && RED_LETTER_BOOKS.includes(book)) {
                        applyRedLetters(book, chapter, chapterElement);
                    }
                }
            }
        });
    });

    // Start observing the Bible content container
    const bibleContent = document.querySelector('#SUNBIBLE_bible_book');
    if (bibleContent) {
        observer.observe(bibleContent, { childList: true, subtree: true });
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeRedLetters();
    watchForBibleChanges();
});