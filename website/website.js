// Wrap in DOMContentLoaded to ensure DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const bookList = document.querySelector('#bookList');
  const message = document.querySelector('#message');
  const bookForm = document.querySelector('#bookForm');

  const getBookData = () => JSON.parse(localStorage.getItem('bookData')) || {};
  const saveBookData = (data) => localStorage.setItem("bookData", JSON.stringify(data));

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
          <br><hr>
        </div>`;
    }
  };

  window.deleteBook = (isbn) => {
    const bookData = getBookData();
    if (bookData[isbn]) {
      delete bookData[isbn];
      saveBookData(bookData);
      renderBookList();
      message.textContent = `Book with ISBN ${isbn} deleted successfully!`;
      message.style.color = 'green';
    }
  };

  window.editBook = (isbn) => {
    const bookData = getBookData();
    if (bookData[isbn]) {
      const book = bookData[isbn];
      document.querySelector('#title').value = book.title;
      document.querySelector('#author').value = book.author;
      document.querySelector('#isbn').value = isbn;
      document.querySelector('#pubDate').value = book.pubDate;
      document.querySelector('#genre').value = book.genre;
      delete bookData[isbn];
      saveBookData(bookData);
      renderBookList();
      message.textContent = `Editing book with ISBN ${isbn}. Please update the details and submit.`;
      message.style.color = 'blue';
    }
  };

  bookForm.addEventListener('click', function (e) {
    e.preventDefault();

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
    if (bookData[isbn]) {
      message.textContent = `Book with ISBN ${isbn} already exists.`;
      message.style.color = 'red';
      return;
    }

    const book = { title, author, isbn, pubDate, genre };
    bookData[isbn] = book;
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

  //Fetch external API data (JSONPlaceholder example - using titles as fake books)
  async function fetchExternalBooks() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
      const data = await response.json();
      data.forEach(post => {
        const fakeISBN = post.id.toString();
        const bookData = getBookData();
        if (!bookData[fakeISBN]) {
          bookData[fakeISBN] = {
            title: post.title,
            author: 'API Author',
            isbn: fakeISBN,
            pubDate: '2021-01-01',
            genre: 'Fiction'
          };
          saveBookData(bookData);
        }
      });
      renderBookList();
    } catch (error) {
      message.textContent = 'Failed to fetch external books.';
      message.style.color = 'red';
    }
  }

  //search by genre
  async function filterBooksByGenre(genreFilter) {
    const bookData = getBookData();
    const filtered = Object.values(bookData).filter(book => book.genre.toLowerCase().includes(genreFilter.toLowerCase()));
    // turn it into an array from object and use filter to filter the book based on genre 
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

  document.querySelector('.js-filter-button').addEventListener('click', ()=>{
    const genreInputElement = document.querySelector('.genreFilterInput');
    const genreInput = genreInputElement.value.trim();

    filterBooksByGenre(genreInput);
  });

  document.querySelector('.js-show-all-books').addEventListener('click', ()=>{
    renderBookList();
  })

  // Fetch server books and external books on load
  fetchBooksFromServer().then(serverBooks => {
    const bookData = getBookData();
    serverBooks.forEach(book => {
      if (!bookData[book.isbn]) {
        bookData[book.isbn] = book;
      }
    });
    saveBookData(bookData);
    renderBookList();
  });

  fetchExternalBooks();

  renderBookList();
});
