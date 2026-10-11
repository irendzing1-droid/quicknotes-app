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
// --- 2. STATE (The Notes Array) ---
// ==========================================
// We start with an empty array. Later we will load this from localStorage.
let notes = [];

// ==========================================
// --- 3. THE RENDER FUNCTION ---
// Rebuilds the list from the array using createElement and textContent
// ==========================================
function renderNotes() {
    // 1. Clear the current list so we don't duplicate notes
    notesList.textContent = '';

    // 2. Update the count message
    if (notes.length === 0) {
        noteCount.textContent = '0 notes';
    } else if (notes.length === 1) {
        noteCount.textContent = '1 note';
    } else {
        noteCount.textContent = `${notes.length} notes`;
    }

    // 3. Loop through the notes array and create a card for each one
    notes.forEach(note => {
        // Create the list item (the card container)
        const li = document.createElement('li');
        // Add the base class + the category class for coloring
        li.classList.add('note-card', `category-${note.category}`);

        // Create a container for the text and metadata
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('note-content');

        // The note text
        const textP = document.createElement('p');
        textP.classList.add('note-text');
        textP.textContent = note.text; // Safe from XSS

        // The metadata line (Category + Date)
        const metaP = document.createElement('p');
        metaP.classList.add('note-meta');
        metaP.textContent = `${note.category} • ${note.createdAt}`;

        contentDiv.appendChild(textP);
        contentDiv.appendChild(metaP);

        // The Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        // We will add the click event listener later, but we'll add the data-id here
        deleteBtn.dataset.id = note.id;

        // Put it all together
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        // Add the card to the main list
        notesList.appendChild(li);
    });
}

// ==========================================
// --- 4. EVENT LISTENERS ---
// ==========================================

// Handle form submission
noteForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop the page from refreshing

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    // For now, we will skip validation and just add the note
    // (We will add validation in Task 4)

    // Create the new note object
    const newNote = {
        id: Date.now(), // Use timestamp as a unique ID
        text: text,
        category: category,
        createdAt: new Date().toLocaleString() // readable date and time
    };

    // Add to the array
    notes.push(newNote);

    // Re-render the list
    renderNotes();

    // Clear the input
    noteInput.value = '';
    noteInput.focus();
});

// ==========================================
// --- 5. INITIALIZATION ---
// ==========================================
// Run the render function once on page load to set the "0 notes" text
renderNotes();