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
const clearAllBtn = document.querySelector('#clear-all-btn'); // NEW

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
    notesList.textContent = '';

    const searchTerm = searchInput.value.toLowerCase().trim();

    const notesToDisplay = notes.filter(note => 
        note.text.toLowerCase().includes(searchTerm)
    );

    // --- COUNTER TEXT WITH PERIODS ---
    if (notes.length === 0) {
        noteCount.textContent = 'You have no notes yet.';
    } else if (notesToDisplay.length === 0 && searchTerm !== '') {
        noteCount.textContent = '0 notes.';
        
        const noResultsMsg = document.createElement('li');
        noResultsMsg.textContent = 'No notes match your search.';
        noResultsMsg.classList.add('no-results-msg');
        notesList.appendChild(noResultsMsg);
    } else if (notesToDisplay.length === 1) {
        noteCount.textContent = 'You have 1 note.';
    } else {
        noteCount.textContent = `You have ${notesToDisplay.length} notes.`;
    }

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

// Form Submission
noteForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    errorMessage.textContent = '';

    if (text === '') {
        errorMessage.textContent = 'Please type a note first.';
        return; 
    }

    if (text.length > 200) {
        errorMessage.textContent = 'Notes must be 200 characters or fewer.';
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

// Search Input
searchInput.addEventListener('input', renderNotes);

// Clear All Button
clearAllBtn.addEventListener('click', () => {
    // Use the built-in browser confirm dialog
    const userConfirmed = window.confirm("Are you sure you want to clear all notes? This cannot be undone.");
    
    if (userConfirmed) {
        notes = []; // Wipe the array
        saveNotes(); // Wipe localStorage
        renderNotes(); // Update the UI
    }
});

// ==========================================
// --- 7. INITIALIZATION ---
// ==========================================
renderNotes();