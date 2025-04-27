// ✝️
// SUNBIBLE

// PLEASE KEEP THE FUCTIONS CLEARLY NAMED
// AND CONSOLE LOG EVERYTHING

// Initialize IndexedDB
const dbName = 'SunBibleDB';
const dbVersion = 1;
let db;

// Open IndexedDB connection
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);
        
        request.onerror = (event) => {
            console.error('Error opening IndexedDB:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('IndexedDB connection opened successfully');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('bibleBooks')) {
                db.createObjectStore('bibleBooks', { keyPath: 'book' });
                console.log('Bible books store created');
            }
            if (!db.objectStoreNames.contains('contents')) {
                db.createObjectStore('contents');
                console.log('Contents store created');
            }
        };
    });
}

// Function to fetch Bible data from IPFS with retry mechanism
async function fetchBibleData(cid) {
    const maxRetries = 3;
    const baseUrls = [
        'https://bafybeiddtdnmeha6kyusdxpabkjecaxfuiwke57hznv4o4vsrti5l5rqoa.ipfs.w3s.link',
        'https://bafybeiddtdnmeha6kyusdxpabkjecaxfuiwke57hznv4o4vsrti5l5rqoa.ipfs.dweb.link'
    ];

    for (let i = 0; i < maxRetries; i++) {
        for (const baseUrl of baseUrls) {
            const url = `${baseUrl}/${cid}`;
            try {
                console.log(`Attempt ${i + 1}: Fetching Bible data from IPFS: ${url}`);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                    mode: 'cors'
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Bible data fetched successfully:", data);
                return data;
            } catch (error) {
                console.warn(`Attempt ${i + 1} failed for ${url}:`, error);
                if (i === maxRetries - 1 && baseUrl === baseUrls[baseUrls.length - 1]) {
                    console.error("All fetch attempts failed:", error);
                    return null;
                }
            }
        }
    }
    return null;
}

// Function to update the download status
function updateDownloadStatus(status) {
    const statusElement = document.getElementById("DOWNOAD_status");
    statusElement.textContent = status;
    console.log("Download status updated:", status);
}

// Function to store Bible data in IndexedDB
async function storeBibleData(bookName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['bibleBooks'], 'readwrite');
        const store = transaction.objectStore('bibleBooks');
        const request = store.put({ book: bookName, data: data });

        request.onsuccess = () => {
            console.log(`${bookName} stored in IndexedDB successfully`);
            resolve();
        };

        request.onerror = (event) => {
            console.error(`Error storing ${bookName}:`, event.target.error);
            reject(event.target.error);
        };
    });
}

// Function to load Bible data into the UI
function loadBibleData(data) {
    const bibleSection = document.getElementById("SUNBIBLE_bible");
    if (!bibleSection) {
        console.error("Bible section not found");
        return;
    }

    // Ensure the book container exists
    let bookContainer = document.getElementById("SUNBIBLE_bible_book");
    if (!bookContainer) {
        bookContainer = document.createElement("div");
        bookContainer.id = "SUNBIBLE_bible_book";
        bibleSection.appendChild(bookContainer);
    }

    // Clear existing content and load new data
    bookContainer.innerHTML = "";

    if (data && data.book && data.chapters) {
        data.chapters.forEach(chapter => {
            if (chapter) {
                const chapterDiv = document.createElement("div");
                chapterDiv.classList.add("SUNBIBLE_bible_book_chapter");
                chapterDiv.setAttribute('data-book', data.book);
                chapterDiv.setAttribute('data-chapter', chapter.chapter);
                chapterDiv.innerHTML = `<h1><span class="book_name">${data.book}</span> <span class="chapter_number">${chapter.chapter}</span></h1>` +
                    (chapter.verses ? chapter.verses.map(verse => 
                        `<p class="bible_book_chapter_verse"><span class="verse_number">${verse.verse}</span> <span class="verse_text">${verse.text}</span></p>`
                    ).join('') : '');
                bookContainer.appendChild(chapterDiv);
            }
        });
        console.log("Bible data loaded into UI:", data);
    }
}

// Function to show a section and update URL parameters
function showSection(sectionId) {
    // Check download status in IndexedDB
    const transaction = db.transaction(['contents'], 'readonly');
    const store = transaction.objectStore('contents');
    const request = store.get('downloadComplete');

    request.onsuccess = (event) => {
        if (event.target.result === true && sectionId === "FIRST_TIME_DOWNLOAD") {
            sectionId = "SUNBIBLE_bible";
        }
        
        const sections = document.querySelectorAll("section");
        sections.forEach(section => section.style.display = "none");
        const activeSection = document.getElementById(sectionId);
        activeSection.style.display = "block";
        updateUrlParameters(sectionId);
        console.log(`Section displayed: ${sectionId}`);
    };
}

// Function to update URL parameters
function updateUrlParameters(sectionId, book = "", chapter = "") {
    const url = new URL(window.location);
    url.searchParams.set("section", sectionId);
    if (book) url.searchParams.set("book", book);
    if (chapter) url.searchParams.set("chapter", chapter);
    window.history.pushState({}, '', url);
    console.log("URL parameters updated:", url.searchParams.toString());
}

// Function to handle navigation clicks
function setupNavigation() {
    document.querySelector(".BIBLE_loader").addEventListener("click", async () => {
        const currentView = await getCurrentView();
        const lastBook = currentView.book;
        const lastChapter = currentView.chapter;
        await loadBibleContent(lastBook, lastChapter);
        await saveCurrentView(lastBook, lastChapter);
        updateUrlParameters("SUNBIBLE_bible", lastBook, lastChapter);
        showSection("SUNBIBLE_bible");
    });
    document.querySelector(".NAV_loader").addEventListener("click", () => showSection("SUNBIBLE_CONTENTS"));
    document.querySelector(".THEME_loader").addEventListener("click", () => showSection("SUNBIBLE_theme"));
    console.log("Navigation setup complete");
}

// Function to fetch and store Bible data from IPFS
async function fetchAndStoreBibleData() {
    const books = ["Genesis", "1Chronicles", "1Corinthians", "1John", "1Kings", "1Peter", "1Samuel", "1Thessalonians", "1Timothy", "2Chronicles", "2Corinthians", "2John", "2Kings", "2Peter", "2Samuel", "2Thessalonians", "2Timothy", "3John", "Acts", "Amos", "Books", "Colossians", "contents", "Daniel", "Deuteronomy", "Ecclesiastes", "Ephesians", "Esther", "Exodus", "Ezekiel", "Ezra", "Galatians", "Habakkuk", "Haggai", "Hebrews", "Hosea", "Isaiah", "James", "Jeremiah", "Job", "Joel", "John", "Jonah", "Joshua", "Jude", "Judges", "Lamentations", "Leviticus", "Luke", "Malachi", "Mark", "Matthew", "Micah", "Nahum", "Nehemiah", "Numbers", "Obadiah", "Philemon", "Philippians", "Proverbs", "Psalms", "Revelation", "Romans", "Ruth", "SongofSolomon", "Titus", "Zechariah", "Zephaniah"];
    const baseUrl = "https://bafybeiddtdnmeha6kyusdxpabkjecaxfuiwke57hznv4o4vsrti5l5rqoa.ipfs.w3s.link/";
    let allDownloaded = true;

    try {
        await initDB();
        
        const transaction = db.transaction(['contents'], 'readonly');
        const store = transaction.objectStore('contents');
        const downloadComplete = await new Promise(resolve => {
            const request = store.get('downloadComplete');
            request.onsuccess = () => resolve(request.result);
        });

        if (downloadComplete === true) {
            console.log("Download already complete.");
            return;
        }

        for (const book of books) {
            const url = `${baseUrl}${book}.json`;
            try {
                console.log(`Fetching ${book} data from IPFS: ${url}`);
                const response = await fetch(url);
                const data = await response.json();
                await storeBibleData(book, data);
                updateDownloadStatus(`${book} downloaded`);
                console.log(`${book} data stored in IndexedDB.`);
            } catch (error) {
                console.error(`Error fetching ${book} data:`, error);
                allDownloaded = false;
            }
        }

        if (allDownloaded) {
            const contentsTransaction = db.transaction(['contents'], 'readwrite');
            const contentsStore = contentsTransaction.objectStore('contents');
            contentsStore.put(true, 'downloadComplete');
            updateDownloadStatus("Download complete");
            console.log("All books downloaded and stored successfully.");
        } else {
            updateDownloadStatus("Some books failed to download.");
            console.log("Some books failed to download.");
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        updateDownloadStatus("Database initialization failed.");
    }
}

// Function to load Bible content from IndexedDB
async function loadBibleContent(bookName, chapterNum) {
    try {
        console.log(`Attempting to load ${bookName} from IndexedDB`);
        const transaction = db.transaction(['bibleBooks'], 'readonly');
        const store = transaction.objectStore('bibleBooks');
        
        const request = store.get(bookName);
        request.onsuccess = (event) => {
            const bookData = event.target.result?.data;
            if (!bookData) {
                console.error(`${bookName} not found in IndexedDB`);
                return;
            }
            console.log(`Parsed book data:`, bookData);
            
            if (bookData && bookData.book && bookData.chapters) {
                const chapterData = bookData.chapters.find(chap => chap.chapter === chapterNum.toString());
                if (chapterData) {
                    loadBibleData({ book: bookData.book, chapters: [chapterData] });
                    saveCurrentView(bookName, chapterNum);
                    updateUrlParameters('SUNBIBLE_bible', bookName, chapterNum);
                    console.log(`Successfully loaded ${bookName} chapter ${chapterNum} from IndexedDB`);
                } else {
                    console.error(`Chapter ${chapterNum} not found in ${bookName}`);
                }
            } else {
                console.error(`Invalid book data structure for ${bookName}`);
            }
        };

        request.onerror = (event) => {
            console.error(`Error loading Bible content for ${bookName}:`, event.target.error);
        };
    } catch (error) {
        console.error(`Error accessing IndexedDB:`, error);
    }
}

// Function to clear Bible data from IndexedDB
async function clearBibleData() {
    try {
        const transaction = db.transaction(['bibleBooks', 'contents'], 'readwrite');
        const bibleStore = transaction.objectStore('bibleBooks');
        const contentsStore = transaction.objectStore('contents');

        await Promise.all([
            new Promise((resolve, reject) => {
                const request = bibleStore.clear();
                request.onsuccess = resolve;
                request.onerror = reject;
            }),
            new Promise((resolve, reject) => {
                const request = contentsStore.clear();
                request.onsuccess = resolve;
                request.onerror = reject;
            })
        ]);

        updateDownloadStatus("Database cleared");
        console.log("IndexedDB cleared");
    } catch (error) {
        console.error('Error clearing IndexedDB:', error);
    }
}

// Function to update Bible data
async function updateBibleData() {
    await clearBibleData();
    await fetchAndStoreBibleData();
    console.log("Bible data updated");
}

// Function to calculate and display the size of IndexedDB
async function displayLocalStorageSize() {
    try {
        const transaction = db.transaction(['bibleBooks'], 'readonly');
        const store = transaction.objectStore('bibleBooks');
        const request = store.getAll();

        request.onsuccess = () => {
            const data = request.result;
            const totalSize = new Blob([JSON.stringify(data)]).size;
            const sizeInKB = (totalSize / 1024).toFixed(2);
            const sizeElement = document.getElementById("LOCAL_STORAGE_SIZE");
            sizeElement.textContent = `Database Size: ${sizeInKB} KB`;
            console.log("IndexedDB size displayed:", sizeInKB, "KB");
        };
    } catch (error) {
        console.error('Error calculating database size:', error);
    }
}

// Function to save current view in IndexedDB
async function saveCurrentView(bookName, chapter) {
    try {
        const transaction = db.transaction(['contents'], 'readwrite');
        const store = transaction.objectStore('contents');
        await Promise.all([
            new Promise((resolve, reject) => {
                const request = store.put(bookName, 'currentBook');
                request.onsuccess = resolve;
                request.onerror = reject;
            }),
            new Promise((resolve, reject) => {
                const request = store.put(chapter, 'currentChapter');
                request.onsuccess = resolve;
                request.onerror = reject;
            })
        ]);
        console.log('Current view saved:', bookName, chapter);
    } catch (error) {
        console.error('Error saving current view:', error);
    }
}

// Function to get current view from IndexedDB
async function getCurrentView() {
    try {
        const transaction = db.transaction(['contents'], 'readonly');
        const store = transaction.objectStore('contents');
        const [book, chapter] = await Promise.all([
            new Promise((resolve) => {
                const request = store.get('currentBook');
                request.onsuccess = () => resolve(request.result || 'Genesis');
            }),
            new Promise((resolve) => {
                const request = store.get('currentChapter');
                request.onsuccess = () => resolve(request.result || 1);
            })
        ]);
        return { book, chapter };
    } catch (error) {
        console.error('Error getting current view:', error);
        return { book: 'Genesis', chapter: 1 };
    }
}

// Function to initialize the app
async function initializeApp() {
    try {
        await initDB();
        setupNavigation();
        
        const transaction = db.transaction(['contents'], 'readonly');
        const store = transaction.objectStore('contents');
        const downloadComplete = await new Promise(resolve => {
            const request = store.get('downloadComplete');
            request.onsuccess = () => resolve(request.result);
        });

        if (downloadComplete === true) {
            // Hide download section and show Bible content immediately
            document.getElementById('FIRST_TIME_DOWNLOAD').style.display = 'none';
            updateDownloadStatus("Download complete");
            
            const urlParams = new URLSearchParams(window.location.search);
            const section = urlParams.get('section') === 'FIRST_TIME_DOWNLOAD' ? 'SUNBIBLE_bible' : (urlParams.get('section') || 'SUNBIBLE_bible');
            const currentView = await getCurrentView();
            
            // Use URL parameters first, then stored view, then default to Genesis 1
            const book = urlParams.get('book') || currentView.book;
            const chapter = parseInt(urlParams.get('chapter') || currentView.chapter);
            
            showSection(section);
            if (section === 'SUNBIBLE_bible') {
                await loadBibleContent(book, chapter);
                await saveCurrentView(book, chapter);
                updateUrlParameters(section, book, chapter);
            } else {
                updateUrlParameters(section);
            }
        } else {
            showSection('FIRST_TIME_DOWNLOAD');
            await fetchAndStoreBibleData();
            
            const downloadCheckTransaction = db.transaction(['contents'], 'readonly');
            const downloadCheckStore = downloadCheckTransaction.objectStore('contents');
            const downloadStatus = await new Promise(resolve => {
                const request = downloadCheckStore.get('downloadComplete');
                request.onsuccess = () => resolve(request.result);
            });
            
            if (downloadStatus === true) {
                // Redirect to Bible section after successful download
                showSection('SUNBIBLE_bible');
                await loadBibleContent('Genesis', 1);
                await saveCurrentView('Genesis', 1);
                updateUrlParameters('SUNBIBLE_bible', 'Genesis', 1);
            } else {
                updateDownloadStatus("Download failed");
            }
        }

        // Display database size
        await displayLocalStorageSize();

        // Add event listeners for buttons
        document.getElementById('UPDATE_BIBLE_DATA').addEventListener('click', updateBibleData);
        document.getElementById('CLEAR_BIBLE_DATA').addEventListener('click', clearBibleData);
    } catch (error) {
        console.error('Error initializing app:', error);
        updateDownloadStatus("Initialization failed");
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);


