const author = document.querySelector('#author');
const title = document.querySelector('#title');
const pages = document.querySelector('#pages');
const readOption = document.querySelector('#isRead');
const addBtn = document.querySelector('#addBook');
const cardBody = document.querySelector('.card-body');
const bookContainer = document.querySelector('.list-group');

//  Array to hold books
let myLibrary;
let bookIndex = 0;
if(localStorage.getItem('books') === null) {
    myLibrary = [];
} else {
    myLibrary = JSON.parse(localStorage.getItem('books'));

    const books = JSON.parse(localStorage.getItem('books'));

    books.forEach(book => {
        render(book);
    });
}

//  Load event listeners
loadEventListeners();

function loadEventListeners() {
    //  Add book event
    addBtn.addEventListener('click', addBookToLibrary);

    //  Remove book
    bookContainer.addEventListener('click', removeBook);
}

//  Book constructor
function Book(title, author, numOfPages, isRead) {
    this.title = title;
    this.author = author;
    this.numOfPages = numOfPages;
    this.isRead = isRead;
    this.info = function() {
        return `${this.title} by ${this.author}, ${this.numOfPages} pages, ${this.isRead ? 'have been read' : 'not read yet'}`;
    }
}

//  Add book to library
function addBookToLibrary() {
    if(title.value !== '' && author.value !== '' && pages.value !== '' && readOption.value !== '') {
        const book = new Book(title.value, author.value, pages.value, readOption.value === 'true' ? true : false);
        myLibrary.push(book);

        localStorage.setItem('books', JSON.stringify(myLibrary));
        render(book);
    } else {
        alert('Please input all fields');
    }
}

//  Toggle Read
function read(isRead){
    return isRead ? `<button type="button" class="btn btn-sm btn-light">Read</button>` : `<button type="button" class="btn btn-sm btn-dark">Not Read</button>`;
}

function render(book) {
    const bookList = document.createElement('div');
    bookIndex++;
    bookList.className = 'jumbotron py-3';
    bookList.innerHTML = '<a class="float-right"><span class="text-dark">&times;</span></a>';
    bookList.innerHTML += `<h4>${book.title}</h4>`;
    bookList.innerHTML += `<p class="lead">By ${book.author} <span class="text-muted float-right">${book.numOfPages} Pg.</span></p>`;
    bookList.innerHTML += read(book.isRead);

    bookList.setAttribute('data-attribute', String(bookIndex));

    bookContainer.appendChild(bookList);

    title.value = author.value = pages.value = '';
}

function removeBook(e) {
    if(e.target.parentElement.classList.contains('float-right')) {
        const bookInd = e.target.parentElement.parentElement.getAttribute('data-attribute');
        if(confirm('Are you sure you want to delete book?')) {
            e.target.parentElement.parentElement.remove();
            if(myLibrary.length == 1) {
                myLibrary = [];
                bookIndex = 0;
            } else if(myLibrary.length > 0) {
                myLibrary.splice(bookInd - 1, 1);
            }

            localStorage.setItem('books', JSON.stringify(myLibrary));
        }
    }

    if(e.target.classList.contains('btn')) {
        if(e.target.textContent === 'Read') {
            e.target.textContent = 'Not Read';
            e.target.classList.remove('btn-light');
            e.target.classList.add('btn-dark');
        } else {
            e.target.textContent = 'Read';
            e.target.classList.remove('btn-dark');
            e.target.classList.add('btn-light');
        }

        const bookInd = e.target.parentElement.getAttribute('data-attribute');
        myLibrary[bookInd - 1].isRead = !(myLibrary[bookInd - 1].isRead);
        localStorage.setItem('books', JSON.stringify(myLibrary));
    }
}