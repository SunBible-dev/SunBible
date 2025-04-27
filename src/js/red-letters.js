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
    console.log('Initializing IndexedDB for red letters...');
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(RED_LETTERS_DB_NAME, 1);

        request.onerror = () => {
            console.error('Failed to open IndexedDB:', request.error);
            reject(request.error);
        };
        request.onsuccess = () => {
            console.log('Successfully opened IndexedDB');
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
    console.log(`Fetching red letter data for ${book} from IPFS...`);
    try {
        const url = `${RED_LETTERS_IPFS_URL}/${book === '1Corinthians' ? '1Corinthians' : book.toLowerCase()}-red-letter-ids.json`;
        console.log('Fetching from URL:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log(`Successfully fetched data for ${book}, saving to IndexedDB...`);
        await saveRedLetterData(book, data);
        console.log(`Data for ${book} saved successfully`);
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
        const chapterData = redLetterData[String(chapterNum)];
        if (!chapterData) {
            console.log('No chapter data found for:', book, chapterNum);
            return;
        }
        console.log('Found chapter data:', chapterData);

        // Process each verse with red letters
        if (!Array.isArray(chapterData.verses)) {
            console.log('Invalid verse data structure:', chapterData);
            return;
        }

        chapterData.verses.forEach(verseData => {
            console.log('Processing verse data:', verseData);
            const verseElements = chapterElement.getElementsByClassName('bible_book_chapter_verse');
            const verseElement = Array.from(verseElements).find(el => {
                const verseNumber = el.querySelector('.verse_number');
                const match = verseNumber && verseNumber.textContent === String(verseData.verse);
                if (!match) {
                    console.log('Verse number mismatch:', verseNumber?.textContent, 'vs', verseData.verse);
                }
                return match;
            });
            if (!verseElement) return;

            const verseText = verseElement.querySelector('.verse_text');
            if (!verseText) return;

            // Split text into words and punctuation while preserving spaces
            const text = verseText.textContent;
            const words = text.split(/([\s.,!?;]|[\w']+)/).filter(Boolean);
            
            // Parse word IDs and create ranges
            const wordRanges = verseData.word_ids.split(',').map(id => {
                const [start, end] = id.split('-').map(Number);
                return end ? Array.from({length: end - start + 1}, (_, i) => start + i) : [start];
            }).flat();
            const redPositions = new Set(wordRanges);
            
            // Build the new verse text with red letters
            let newText = '';
            let currentWord = 1;
            
            words.forEach(word => {
                if (/[\s.,!?;]/.test(word)) {
                    newText += word; // Preserve whitespace and punctuation
                } else {
                    if (redPositions.has(currentWord)) {
                        newText += `<span class="red-letters">${word}</span>`;
                    } else {
                        newText += word;
                    }
                    currentWord++;
                }
            });

            // Update the verse text and trigger a custom event
            verseText.innerHTML = newText.trim();
            verseElement.dispatchEvent(new CustomEvent('redLettersApplied'));
        });
    } catch (error) {
        console.error('Error applying red letters:', error);
    }
}

// Initialize database and start background downloads
async function initializeRedLetters() {
    console.log('Starting red letters initialization...');
    try {
        await initRedLettersDb();
        console.log('Starting background downloads for red letter books:', RED_LETTER_BOOKS);
        // Start background downloads for all red letter books
        RED_LETTER_BOOKS.forEach(book => {
            console.log(`Checking data for book: ${book}`);
            getRedLetterData(book).then(data => {
                if (!data) {
                    console.log(`No cached data found for ${book}, fetching from IPFS...`);
                    fetchRedLetterData(book);
                } else {
                    console.log(`Found cached data for ${book}`);
                }
            });
        });
    } catch (error) {
        console.error('Error initializing red letters:', error);
    }
}

// Watch for Bible content changes and apply red letters
function watchForBibleChanges() {
    console.log('Setting up Bible content observer...');
    const observer = new MutationObserver(mutations => {
        console.log('Detected DOM mutations:', mutations.length);
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                // Look for chapter elements with the SUNBIBLE_bible_book_chapter class
                const chapterElement = mutation.target.closest('.SUNBIBLE_bible_book_chapter');
                if (chapterElement) {
                    const book = chapterElement.getAttribute('data-book');
                    const chapter = chapterElement.getAttribute('data-chapter');
                    if (book && chapter && RED_LETTER_BOOKS.includes(book)) {
                        console.log('Applying red letters to:', book, chapter);
                        applyRedLetters(book, chapter, chapterElement);
                    }
                }
            }
        });
    });

    // Start observing the Bible content container
    const bibleContent = document.querySelector('#SUNBIBLE_bible_book');
    if (bibleContent) {
        console.log('Found Bible content container, starting observation');
        observer.observe(bibleContent, { childList: true, subtree: true, characterData: true });
        console.log('Bible content observer successfully initialized');
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting red letters system');
    initializeRedLetters();
    watchForBibleChanges();
});