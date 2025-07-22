export function getBookData() {
    try {
        const bookdata = localStorage.getItem('bookData');
        // Check if bookdata exists and is not null/empty
        if (bookdata === null || bookdata === '') {
            return []; // Return empty array if no data
        }
        return JSON.parse(bookdata);
    } catch (error) {
        console.error('Error parsing book data:', error);
        return []; // Return empty array if parsing fails
    }
}
  
export function saveBookData(data) {
    try {
        localStorage.setItem("bookData", JSON.stringify(data));
    } catch (error) {
        console.error('Error saving book data:', error);
    }
}

export function renderBookList() {
    const books = getBookData();
    bookList.innerHTML = '<h2>Book List</h2>';
    books.forEach(book => {
      const bookAge = new Date().getFullYear() - new Date(book.pubDate).getFullYear();
      bookList.innerHTML += `
        <div class="book-item">
          <strong>${book.title}</strong> by ${book.author}<br>
          ISBN: ${book.isbn}, Age: ${bookAge} years, Genre: ${book.genre} <br>
          <button onclick="handleDeleteBook('${book.isbn}')">Delete</button>
          <button class="js-edit-button" data-book-isbn="${book.isbn}">Edit</button>
          <br><hr>
        </div>`;
    });

}