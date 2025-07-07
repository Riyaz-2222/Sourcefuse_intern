document.addEventListener('DOMContentLoaded', () => {
const bookList = document.querySelector('#bookList');
const message = document.querySelector('#message');
const bookForm = document.querySelector('#bookForm');

const getBookData = () =>  JSON.parse(localStorage.getItem('bookData')) || {}; 
const saveBookData = (data) =>  localStorage.setItem("bookData",JSON.stringify(data)); 

const renderBookList = () => {
  const books = getBookData();
  bookList.innerHTML = '<h2>Book List</h2>';
  for (const isbn in books) {
    const book = books[isbn];
    const bookAge = new Date().getFullYear() - new Date(book.pubDate).getFullYear();
  
  
  bookList.innerHTML += `
   <div class="book-item">
      <strong>${book.title}</strong> by ${book.author}<br>
      ISBN: ${isbn}, Age: ${bookAge} years, Genre: ${book.genre} <br>
      <button onclick="deleteBook('${isbn}')">Delete</button>
      <button onclick="editBook('${isbn}')">Edit</button>
      <br>
      <hr>
    </div>
    `;
  }
};
// windows used to access the function globally as html for this is not writtten in the html file directly
 window.deleteBook = (isbn) => {
  const bookData = getBookData();
  if (bookData[isbn]) {
    delete bookData[isbn];
    saveBookData(bookData);
    renderBookList();
    message.textContent = `Book with ISBN ${isbn} deleted successfully!`;
    message.style.color = 'green';
  }
}
window.editBook = (isbn) => {
  const bookData = getBookData();
  if (bookData[isbn]) {
    const book = bookData[isbn];
    document.querySelector('#title').value = book.title;
    document.querySelector('#author').value = book.author;
    document.querySelector('#isbn').value = isbn;
    document.querySelector('#pubDate').value = book.pubDate;
    document.querySelector('#genre').value = book.genre;
    delete bookData[isbn]; // Remove the book from the list to avoid duplicates
    saveBookData(bookData);
    renderBookList(); 
    message.textContent = `Editing book with ISBN ${isbn}. Please update the details and submit.`;
    message.style.color = 'blue';
}
}

bookForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Collect values
  const title = document.querySelector('#title').value.trim();
  const author = document.querySelector('#author').value.trim();
  const isbn = document.querySelector('#isbn').value.trim();
  const pubDate = document.querySelector('#pubDate').value;
  const genre = document.querySelector('#genre').value.trim();
  

  if (title === '' || author === '' || isbn === '' || pubDate === '' || genre === '') {
    message.textContent = 'Please fill in all fields.';
    message.style.color = 'red';
    return;
  }
    // Create book object
        const book = { title, author, isbn, pubDate, genre };
        const bookData = getBookData();
    // checks if ISBN is a number
    if(isNaN(isbn)){
      message.textContent = 'ISBN must be a number.';
      message.style.color = 'red';
      return;
    }

    

    // Check if ISBN already exists
    if (bookData[isbn]) {
      message.textContent = `Book with ISBN ${isbn} already exists.`;
      message.style.color = 'red';
      return;
    }

    // Add book using ISBN as key
    bookData[isbn] = book;
    saveBookData(bookData);

    // Success message
    message.textContent = `Book "${title}" added successfully!`;
    message.style.color = 'green';

    // Reset the form
    bookForm.reset();
    renderBookList();
});
  renderBookList();
});
