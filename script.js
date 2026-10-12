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
// Load notes from localStorage, or start with an empty array if none exist
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

    // Get the search term (we will use this in the filter step)
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Filter notes based on search term
    const notesToDisplay = notes.filter(note => 
        note.text.toLowerCase().includes(searchTerm)
    );

    // Update the count message based on what is displayed
     if (notes.length === 0) {
        // The notes array is completely empty
        noteCount.textContent = 'You have no notes yet';
    } else if (notesToDisplay.length === 0 && searchTerm !== '') {
        // The user searched, but found no matching notes
        noteCount.textContent = '0 notes';
        
        // Create the "No results" message in the list
        const noResultsMsg = document.createElement('li');
        noResultsMsg.textContent = 'No notes match your search.';
        noResultsMsg.classList.add('no-results-msg'); // Add a class for styling
        notesList.appendChild(noResultsMsg);
    } else if (notesToDisplay.length === 1) {
        noteCount.textContent = '1 note';
    } else {
        noteCount.textContent = `${notesToDisplay.length} notes`;
    }

    //  Loop through the filtered notes and create a card for each one
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
    // Keep only the notes that don't match the id
    notes = notes.filter(note => note.id !== id);
    
    saveNotes();   // Update localStorage
    renderNotes(); // Update the UI
}

// ==========================================
// --- 6. EVENT LISTENERS ---
// ==========================================

// Handle form submission
noteForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    // Clear any previous error messages
    errorMessage.textContent = '';

    // --- NEW: VALIDATION ---
      if (text === '') {
        errorMessage.textContent = 'Error: Note text cannot be empty.'; // Updated wording
        return; 
    }

    if (text.length > 200) {
        errorMessage.textContent = 'Error: Note cannot exceed 200 characters.'; // Updated wording
        return; 
    }

    // Create the new note object
    const newNote = {
        id: Date.now(), 
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveNotes();   // Save to localStorage
    renderNotes(); // Update the UI

    // Clear the input
    noteInput.value = '';
    noteInput.focus();
});

// --- NEW: Handle Search Input ---
searchInput.addEventListener('input', renderNotes);

// ==========================================
// --- 7. INITIALIZATION ---
// ==========================================
renderNotes();