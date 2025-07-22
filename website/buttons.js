import { getBookData, saveBookData } from "./book-data.js";

// Delete book function
export function deleteBook(isbn, renderBookList,message) {
    
    let bookData = getBookData();
    const bookExists = bookData.find(book => book.isbn === isbn);
    
    if (bookExists) {
        // Remove the book from array using filter
        bookData = bookData.filter(book => book.isbn !== isbn);
        saveBookData(bookData);
        renderBookList();
        message.textContent = `Book with ISBN ${isbn} deleted successfully!`;
        message.style.color = 'green';
    } else {
        message.textContent = `Book with ISBN ${isbn} not found.`;
        message.style.color = 'red';
    }
}

// Edit book function
export function editBook(isbn, renderBookList, message) {
    let bookData = getBookData();
    const bookToEdit = bookData.find(book => book.isbn === isbn);
    
    if (bookToEdit) {
        // Fill form with book details
        document.querySelector('#title').value = bookToEdit.title;
        document.querySelector('#author').value = bookToEdit.author;
        document.querySelector('#isbn').value = bookToEdit.isbn;
        document.querySelector('#pubDate').value = bookToEdit.pubDate;
        document.querySelector('#genre').value = bookToEdit.genre;
        
        // Remove book from array for editing
        bookData = bookData.filter(book => book.isbn !== isbn);
        saveBookData(bookData);
        renderBookList();
        message.textContent = `Editing book with ISBN ${isbn}. Please update the details and submit.`;
        message.style.color = 'blue';
    } else {
        message.textContent = `Book with ISBN ${isbn} not found.`;
        message.style.color = 'red';
    }
}