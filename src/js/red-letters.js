// Red Letters functionality for SUNBIBLE

// IPFS Gateway URL for red letters data
const RED_LETTERS_IPFS_URL = 'https://w3s.link/ipfs/bafybeicccsyr727druhqp2i3rseucgfpfa2qjcompafdwx54n4k37cthj4';

// Books that have red letters
const RED_LETTER_BOOKS = ['Matthew', 'Mark', 'Luke', 'John', '1Corinthians', 'Revelation'];

// IndexedDB setup
const RED_LETTERS_DB_NAME = 'sunbible_red_letters';
const RED_LETTERS_STORE_NAME = 'red_letter_ids';
let redLettersDb;

// Initialize IndexedDB
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
        const response = await fetch(`${RED_LETTERS_IPFS_URL}/${book.toLowerCase()}-red-letter-ids.json`);
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
        // Initialize DB if not already done
        if (!redLettersDb) await initRedLettersDb();

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
            const verseElement = chapterElement.querySelector(`[data-verse="${verseData.verse}"]`);
            if (!verseElement) return;

            const words = verseElement.textContent.split(' ');
            const wordIds = verseData.word_ids.split('-').map(Number);
            const [start, end] = wordIds;

            // Wrap the red letter words in a span
            const beforeWords = words.slice(0, start - 1).join(' ');
            const redWords = words.slice(start - 1, end).join(' ');
            const afterWords = words.slice(end).join(' ');

            verseElement.innerHTML = `${beforeWords} <span class="red-letters">${redWords}</span> ${afterWords}`.trim();
        });
    } catch (error) {
        console.error('Error applying red letters:', error);
    }
}

// Export the function to be used by other modules
window.applyRedLetters = applyRedLetters;