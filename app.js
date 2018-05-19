class LocalStorage {

    static getBooks() {
        let books;
        const localBooks = localStorage.getItem('books');

        if (localBooks === null) {
            books = [];
        } else {
            books = JSON.parse(localBooks);
        }
        return books;
    }

    static addBook(book) {
        const books = LocalStorage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks() {
        const books = LocalStorage.getBooks();
        const ui = new UI();

        books.forEach(function (book) {
            ui.addToBookList(book);
        })
    }

    // in theory, isbn number should be unique.
    static deleteBook(isbn) {
        const books = LocalStorage.getBooks();
        books.forEach(function(book, index){
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

    _validateTitle() {
        if (this.title === "") {
            return ("Title must be filled.");
        } else {
            return true;
        }
    }

    _validateAuthor() {
        if (this.author === "") {
            return("Author must be filled.");
        } else {
            return true;
        }
    }

    _validateISBN() {
        if (this.isbn === "") {
            return("ISBN must be filled.");
        } else {
            return true;
        }
    }


    validateFields() {
        let errors = [];
        
        const validTitle = this._validateTitle();
        const validAuthor = this._validateAuthor();
        const validIsbn = this._validateISBN();


        if (validTitle !== true) errors.push(validTitle);
        if (validAuthor !== true) errors.push(validAuthor);
        if (validIsbn !== true) errors.push(validIsbn);

        if (errors.length > 0) return errors;
        else return true;
    }
}


class UI {
    constructor() {

    }

    addToBookList(book) {
        const list = document.getElementById("book-table-body");
        // Create a new row
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete-link">X</a></td>
        `;

        list.appendChild(tr);
    }

    deleteBook(e) {
        e.parentElement.parentElement.remove();
    }

    clearFields() {
        document.getElementById('titleInput').value  = "";
        document.getElementById('authorInput').value = "";
        document.getElementById('isbnInput').value   = "";
    }

    
    showAlert(messages, type) {
        const list = document.getElementById("book-form");
        let error_text = "";
        
        messages.forEach(element => {
            error_text += `! ${element}` + "<br>"
        });
        

        let alertDiv = document.createElement('div');
        alertDiv.innerHTML = `<p>${error_text}</p>`

        if (type === 'success') {
            alertDiv.className = 'alert alert-success';
        } else if (type === 'error') {
            alertDiv.className = 'alert alert-warning';
        } else {
            alertDiv.className = `alert alert-${type}`;
        }
        
        const bookFormColumn = document.getElementById("book-form-column");
        bookFormColumn.insertBefore(alertDiv, list);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }
}

const ui = new UI();


document.addEventListener('DOMContentLoaded', LocalStorage.displayBooks);

document.getElementById('book-form').addEventListener('submit', function (e) {

    e.preventDefault();

    const title  = document.getElementById('titleInput').value;
    const author = document.getElementById('authorInput').value;
    const isbn   = document.getElementById('isbnInput').value; 

    const book = new Book(title, author, isbn);
    
    const validatedFields = book.validateFields();

    if (validatedFields !== true) {
        ui.showAlert(validatedFields, "error");
    } else {
        ui.addToBookList(book);
        LocalStorage.addBook(book);
        ui.clearFields();
    }
});


document.getElementById('book-table-body').addEventListener('click', function (e) {

    e.preventDefault();
    if (e.target.className === 'delete-link') {
        ui.deleteBook(e.target);
        const isbn = e.target.parentElement.previousElementSibling.textContent;
        LocalStorage.deleteBook(isbn);
    }
});
