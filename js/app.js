//  Book Class
class Book {
    constructor(title, author, numOfPages, isRead) {
        this.title = title;
        this.author = author;
        this.numOfPages = numOfPages;
        this.isRead = isRead;
    }
}

class Store {

    static getBook() {
        let myLibrary;
        if(localStorage.getItem('books') === null) {
            myLibrary = [];
        } else {
            myLibrary = JSON.parse(localStorage.getItem('books'));
        }

        return myLibrary;
    }

    static displayBook() {
        const books = Store.getBook();

        books.forEach(function(book) {
            //  Instantiate UI
            const ui = new UI();

            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Store.getBook();
        
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(bookInd) {
        const books = Store.getBook();
        bookInd = bookInd -1;

        books.forEach(function(book, index) {
            if(books.indexOf(book) == bookInd) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

    static toggleRead(bookInd) {
        const books = Store.getBook();
        books[bookInd - 1].isRead = !(books[bookInd - 1].isRead);

        localStorage.setItem('books', JSON.stringify(books));
    }
}

class UI {
    //  Read button
    static read(isRead) {
        return isRead ? `<button type="button" class="btn btn-sm btn-light">Read</button>` : `<button type="button" class="btn btn-sm btn-dark">Not Read</button>`;
    }

    addBookToList(book) {
        //  Create a book list div
        bookIndex++;
        const bookList = document.createElement('div');
        bookList.className = 'jumbotron py-3';
        bookList.innerHTML = '<a class="float-right"><span class="text-dark">&times;</span></a>';
        bookList.innerHTML += `<h4>${book.title}</h4>`;
        bookList.innerHTML += `<p class="lead">By ${book.author} <span class="text-muted float-right">${book.numOfPages} Pg.</span></p>`;
        bookList.innerHTML += UI.read(book.isRead);
        bookList.setAttribute('data-attribute', String(bookIndex));

        document.querySelector('.list-group').appendChild(bookList);
    }

    clearField() {
        document.querySelector('#author').value = '';
        document.querySelector('#title').value = '';
        document.querySelector('#pages').value = '';
    }

    removeBookFromList(target) {
        if(confirm('Are you sure you want to delete book?')) {
            target.parentElement.parentElement.remove();
        }
    }

    toggleReadBtn(target) {
        if(target.textContent === 'Read') {
            target.textContent = 'Not Read';
            target.classList.remove('btn-light');
            target.classList.add('btn-dark');
        } else {
            target.textContent = 'Read';
            target.classList.remove('btn-dark');
            target.classList.add('btn-light');
        }

        Store.toggleRead(target.parentElement.getAttribute('data-attribute'));
    }
}

let bookIndex = 0;
//  EventListeners
//  DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBook);

//  Add book event listener
document.querySelector('#addBook').addEventListener('click', function() {
    const author = document.querySelector('#author'),
        title = document.querySelector('#title'),
        pages = document.querySelector('#pages'),
        readOption = document.querySelector('#isRead');

        //  Instantiate book
        const book = new Book(title.value, author.value, pages.value, readOption.value === 'true' ? true : false);

        //  Instantiate UI
        const ui = new UI();

        //  Add book to list
        ui.addBookToList(book);

        //  Add Book to LS
        Store.addBook(book);

        //  clear input fields
        ui.clearField();
});

document.querySelector('.list-group').addEventListener('click', function(e) {
    //  Remove book event listener
    if(e.target.parentElement.classList.contains('float-right')) {
        //  Instantiate UI
        const ui = new UI();

        //  Remove book from list
        ui.removeBookFromList(e.target);

        //  Remove book from LS
        Store.removeBook(e.target.parentElement.parentElement.getAttribute('data-attribute'));
    }

    //  Toggle read button
    if(e.target.classList.contains('btn')) {
        //  Instantiate UI
        const ui = new UI();

        //  Toggle button
        ui.toggleReadBtn(e.target);
    }
});