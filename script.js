// ==========================================
// --- 1. SELECT ELEMENTS ---
// ==========================================
const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');

// ==========================================
// --- 2. STATE ---
// ==========================================
let notes = JSON.parse(localStorage.getItem('quickNotesData')) || [];

// ==========================================
// --- 3. SAVE TO STORAGE ---
// ==========================================
function saveNotes() {
    localStorage.setItem('quickNotesData', JSON.stringify(notes));
}

// ==========================================
// --- 4. THE RENDER FUNCTION ---
// ==========================================
function renderNotes() {
    // Clear the current list
    notesList.textContent = '';

    // Get the search term
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Filter notes based on search term
    const notesToDisplay = notes.filter(note => 
        note.text.toLowerCase().includes(searchTerm)
    );

    // --- UPDATE: Counter Text to match exact assignment phrasing ---
    if (notes.length === 0) {
        noteCount.textContent = 'You have no notes yet';
    } else if (notesToDisplay.length === 0 && searchTerm !== '') {
        noteCount.textContent = '0 notes';
        
        const noResultsMsg = document.createElement('li');
        noResultsMsg.textContent = 'No notes match your search.';
        noResultsMsg.classList.add('no-results-msg');
        notesList.appendChild(noResultsMsg);
    } else if (notesToDisplay.length === 1) {
        noteCount.textContent = 'You have 1 note'; // Exact phrasing
    } else {
        noteCount.textContent = `You have ${notesToDisplay.length} notes`; // Exact phrasing
    }

    // Loop through the filtered notes and create a card for each one
    notesToDisplay.forEach(note => {
        const li = document.createElement('li');
        li.classList.add('note-card', `category-${note.category}`);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('note-content');

        const textP = document.createElement('p');
        textP.classList.add('note-text');
        textP.textContent = note.text;

        const metaP = document.createElement('p');
        metaP.classList.add('note-meta');
        metaP.textContent = `${note.category} • ${note.createdAt}`;

        contentDiv.appendChild(textP);
        contentDiv.appendChild(metaP);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = note.id;

        deleteBtn.addEventListener('click', () => {
            deleteNote(note.id);
        });

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

// ==========================================
// --- 5. DELETE FUNCTION ---
// ==========================================
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
}

// ==========================================
// --- 6. EVENT LISTENERS ---
// ==========================================

noteForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    errorMessage.textContent = '';

    // --- UPDATE: Validation Text to match exact assignment phrasing ---
    if (text === '') {
        errorMessage.textContent = 'Please type a note first.'; // Exact phrasing
        return; 
    }

    if (text.length > 200) {
        errorMessage.textContent = 'Notes must be 200 characters or fewer.'; // Exact phrasing
        return; 
    }

    const newNote = {
        id: Date.now(), 
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveNotes();
    renderNotes();

    noteInput.value = '';
    noteInput.focus();
});

searchInput.addEventListener('input', renderNotes);

// ==========================================
// --- 7. INITIALIZATION ---
// ==========================================
renderNotes();