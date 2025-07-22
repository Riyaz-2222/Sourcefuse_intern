import { getBookData, saveBookData , renderBookList } from "./book-data.js";
import { deleteBook, editBook } from "./buttons.js";

// Wrap in DOMContentLoaded to ensure DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const bookList = document.querySelector('#bookList');
  const message = document.querySelector('#message');
  const bookForm = document.querySelector('#bookForm');

  // Returns array instead of object
  renderBookList();

  // document.querySelectorAll('.js-delete-button').addEventListener('click',()=>{
  //   const bookDetails = 
  // })
  // Make functions available globally for onclick handlers
  // (Edit button listeners are now attached in renderBookList)

  // Attach event listeners to all edit buttons
    document.querySelectorAll('.js-edit-button').forEach(btn => {
      btn.addEventListener('click', function() {
        const isbn = btn.dataset.bookIsbn;
        window.handleEditBook(isbn);
      });
    });
  window.handleEditBook = (isbn) => {
    editBook(isbn, renderBookList, message);
  };
  window.handleDeleteBook = (isbn)=>{
    deleteBook(isbn, renderBookList,message);
  }

  document.querySelector('.book-item').addEventListener

  bookForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Fixed: added missing parameter

    const title = document.querySelector('#title').value.trim();
    const author = document.querySelector('#author').value.trim();
    const isbn = document.querySelector('#isbn').value.trim();
    const pubDate = document.querySelector('#pubDate').value;
    const genre = document.querySelector('#genre').value.trim();

    if (!title || !author || !isbn || !pubDate || !genre) {
      message.textContent = 'Please fill in all fields.';
      message.style.color = 'red';
      return;
    }

    if (isNaN(isbn)) {
      message.textContent = 'ISBN must be a number.';
      message.style.color = 'red';
      return;
    }

    const bookData = getBookData();
    
    // Checking if ISBN exists in array using find()
    const existingBook = bookData.find(book => book.isbn === isbn);
    if (existingBook) {
      message.textContent = `Book with ISBN ${isbn} already exists.`;
      message.style.color = 'red';
      return;
    }

    bookData.push({
      title: title,
      author: author,
      isbn: isbn,
      pubDate: pubDate,
      genre: genre
    });
    saveBookData(bookData);

    message.textContent = `Book "${title}" added successfully!`;
    message.style.color = 'green';

    bookForm.reset();
    renderBookList();
  });

  // Simulate server request using Promises
  function fetchBooksFromServer() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const books = [
          { title: "Server Book 1", author: "Author A", isbn: "101", pubDate: "2020-01-01", genre: "Sci-Fi" },
          { title: "Server Book 2", author: "Author B", isbn: "102", pubDate: "2018-05-10", genre: "Drama" }
        ];
        resolve(books);
      }, 1500);
    });
  }

  // Fetch external API data (JSONPlaceholder example - using titles as fake books)
  async function fetchExternalBooks() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
      const data = await response.json();
      const bookData = getBookData();
      
      data.forEach(post => {
        const fakeISBN = post.id.toString();
        
        // Check if ISBN exists in array
        const existingBook = bookData.find(book => book.isbn === fakeISBN);
        
        if (!existingBook) {
          const newBook = {
            title: post.title,
            author: 'API Author',
            isbn: fakeISBN,
            pubDate: '2021-01-01',
            genre: 'Fiction'
          };
          // Push to array instead of assigning to object key
          bookData.push(newBook);
        }
      });
      
      saveBookData(bookData);
      renderBookList();
    } catch (error) {
      message.textContent = 'Failed to fetch external books.';
      message.style.color = 'red';
    }
  }

  // Filter array directly instead of converting from object
  async function filterBooksByGenre(genreFilter) {
    const bookData = getBookData();
    const filtered = bookData.filter(book => 
      book.genre.toLowerCase().includes(genreFilter.toLowerCase())
    );
    
    bookList.innerHTML = '<h2>Filtered Books</h2>';
    filtered.forEach(book => {
      bookList.innerHTML += `
        <div class="book-item">
          <strong>${book.title}</strong> by ${book.author}<br>
          ISBN: ${book.isbn}, Genre: ${book.genre}
          <hr>
        </div>`;
    });
  }

  document.querySelector('.js-filter-button').addEventListener('click', () => {
    const genreInputElement = document.querySelector('.genreFilterInput');
    const genreInput = genreInputElement.value.trim();

    filterBooksByGenre(genreInput);
  });

  document.querySelector('.js-show-all-books').addEventListener('click', () => {
    renderBookList();
  });

  // Merge server books into array
  fetchBooksFromServer().then(serverBooks => {
    const bookData = getBookData();
    
    serverBooks.forEach(book => {
      // Check if book with this ISBN already exists
      const existingBook = bookData.find(existingBook => existingBook.isbn === book.isbn);
      
      if (!existingBook) {
        bookData.push(book);
      }
    });
    
    saveBookData(bookData);
    renderBookList();
  });

  fetchExternalBooks();
  renderBookList();
});