// Red Letters functionality for SUNBIBLE

// IPFS Gateway URL for red letters data
const RED_LETTERS_IPFS_URL = 'https://w3s.link/ipfs/bafybeia3cis7aa523o2alefwkdnolfzpkrxbpy3eizeylgpgflfwlkc6ge';

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
        const chapterData = redLetterData[book]?.find(ch => ch.chapter === String(chapterNum));
        if (!chapterData) return;

        // Process each verse with red letters
        if (!Array.isArray(chapterData.verses)) {
            console.log('Invalid verse data structure:', chapterData);
            return;
        }

        // Create a map of verse elements for faster lookup
        const verseElementMap = new Map();
        Array.from(chapterElement.getElementsByClassName('bible_book_chapter_verse')).forEach(el => {
            const verseNumber = el.querySelector('.verse_number');
            if (verseNumber) {
                verseElementMap.set(verseNumber.textContent, el);
            }
        });

        chapterData.verses.forEach(verseData => {
            const verseElement = verseElementMap.get(String(verseData.verse));
            if (!verseElement) return;

            const verseText = verseElement.querySelector('.verse_text');
            if (!verseText) return;

            // Split text into words while preserving spaces and punctuation
            const text = verseText.textContent;
            const textParts = text.split(/([\s\p{P}]+)/u);
            const words = textParts.filter(part => part.match(/[\w']+/));
            
            // Parse word IDs range
            const [start, end] = verseData.word_ids.split('-').map(Number);
            const redRange = {start, end};
            
            // Build the new verse text with red letters
            let newText = '';
            let wordCount = 0;
            
            // Process each part of the text
            textParts.forEach(part => {
                if (part.match(/[\w']+/)) {
                    wordCount++;
                    if (wordCount >= redRange.start && wordCount <= redRange.end) {
                        newText += `<span class="red-letters">${part}</span>`;
                    } else {
                        newText += part;
                    }
                } else {
                    newText += part; // Preserve spaces and punctuation
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

// Debounce function to limit the frequency of function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Set to keep track of processed chapters
const processedChapters = new Set();

// Watch for Bible content changes and apply red letters
function watchForBibleChanges() {
    // Debounced version of applyRedLetters
    const debouncedApplyRedLetters = debounce((book, chapter, element) => {
        const chapterKey = `${book}-${chapter}`;
        if (!processedChapters.has(chapterKey)) {
            console.log('Applying red letters to:', book, chapter);
            applyRedLetters(book, chapter, element);
            processedChapters.add(chapterKey);
        }
    }, 250); // Wait 250ms before processing

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            // Skip if this is a characterData mutation (text content change)
            if (mutation.type === 'characterData') continue;
            
            // Check both the target and added nodes for chapter elements
            const targets = [mutation.target, ...Array.from(mutation.addedNodes)];
            for (const target of targets) {
                if (!(target instanceof Element)) continue;
                
                // Find the closest chapter element
                const chapterElement = target.classList?.contains('SUNBIBLE_bible_book_chapter') 
                    ? target 
                    : target.closest('.SUNBIBLE_bible_book_chapter');
                
                if (chapterElement) {
                    const book = chapterElement.getAttribute('data-book');
                    const chapter = chapterElement.getAttribute('data-chapter');
                    if (book && chapter && RED_LETTER_BOOKS.includes(book)) {
                        debouncedApplyRedLetters(book, chapter, chapterElement);
                    }
                }
            }
        }
    });

    // Start observing the Bible content container
    const bibleContent = document.querySelector('#SUNBIBLE_bible_book');
    if (bibleContent) {
        // Check for any existing chapter content
        const existingChapters = bibleContent.getElementsByClassName('SUNBIBLE_bible_book_chapter');
        Array.from(existingChapters).forEach(chapterElement => {
            const book = chapterElement.getAttribute('data-book');
            const chapter = chapterElement.getAttribute('data-chapter');
            if (book && chapter && RED_LETTER_BOOKS.includes(book)) {
                const chapterKey = `${book}-${chapter}`;
                if (!processedChapters.has(chapterKey)) {
                    applyRedLetters(book, chapter, chapterElement);
                    processedChapters.add(chapterKey);
                }
            }
        });
        
        // Start observing for future changes with optimized configuration
        observer.observe(bibleContent, { 
            childList: true, 
            subtree: true,
            attributes: true,
            attributeFilter: ['data-book', 'data-chapter'],
            characterData: false // Disable character data observation
        });
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting red letters system');
    initializeRedLetters();
    watchForBibleChanges();
});