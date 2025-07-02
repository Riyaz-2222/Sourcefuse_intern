document.querySelector('#bookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Collect values
  const title = document.querySelector('#title').value.trim();
  const author = document.querySelector('#author').value.trim();
  const isbn = document.querySelector('#isbn').value.trim();
  const pubDate = document.querySelector('#pubDate').value;
  const genre = document.querySelector('#genre').value.trim();
  const message = document.querySelector('#message');

  if (title && author && isbn && pubDate && genre) {
    // Create book object
    const book = { title, author, isbn, pubDate, genre };

    // Get book object from localStorage or initialize
    let bookData = JSON.parse(localStorage.getItem('bookData')) || {};

    // Check if ISBN already exists
    if (bookData[isbn]) {
      message.textContent = `Book with ISBN ${isbn} already exists.`;
      message.style.color = 'red';
      return;
    }

    // Add book using ISBN as key
    bookData[isbn] = book;

    // Save to localStorage
    localStorage.setItem('bookData', JSON.stringify(bookData));

    // Success message
    message.textContent = `Book "${title}" added successfully!`;
    message.style.color = 'green';

    // Reset the form
    document.querySelector('#bookForm').reset();
  } else {
    message.textContent = 'Please fill in all fields.';
    message.style.color = 'red';
  }
});
