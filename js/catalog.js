/* This script allows to manage information about books (keep book catalogue):
    - author, title, genre, reviews of a book can be stored;
    - in catalogue books can be added, edited or removed;
    - information is listed in a table and stored in session storage 
*/

let bookArray = []; // will be used to store all the Book objects created.

let nextID = 0; // to keep track, what ID to use for new added book

let numberOfBooksChecked = 0; // to keep track on how many books are checked to delete

let bookTableBody = document.getElementById("bookTableBody");

class Book {
    constructor(author, title, genre, reviews) {
        this.id = nextID; //auto assign id
        nextID += 1; // ensure that nextID is greater than any existent
        this.author = author;
        this.title = title;
        this.genre = genre;
        this.reviews = reviews;
    }
}

let defaultBook = new Book("", "", "", ""); //new book default data

// to fill a table row element that represents a book
function fillTableRow(tr, book) {
    if (tr == undefined) {
        tr = document.createElement("tr");
        tr.id = book.id;
        // ensure that nextID is greater than any existent
        if (nextID - book.id <= 0) {
            nextID = book.id + 1;
        }
    } else { //clear the table row
        tr.innerHTML = null;
    }

    // checkbox
    let td = document.createElement("td");
    td.innerHTML = '<input class="bookCheckbox" type="checkbox">';
    td.firstChild.addEventListener("click",changeBookCheckbox);
    tr.appendChild(td);

    for (const key in book) {

        td = document.createElement("td");
        td.className = "editable";
        td.addEventListener("click", editBook);
        td.innerText = book[key];
        tr.appendChild(td);
    }

    return tr
}

/* fills the book table with books from bookArray,
if the optional parameter is true - only last element of the bookArray will be added to the table */
function fillBookTable(addOnlyLastOne = false) {
    let startingIndex = 0;
    if (addOnlyLastOne) {
        startingIndex = bookArray.length - 1; // start from last element of bookArray
    } else {
        bookTableBody.innerHTML = null; //clean the table body, as whole table body will be refilled
    }

    for (let index = startingIndex; index < bookArray.length; index++) {
        const book = bookArray[index];
        let tr = fillTableRow(undefined, book);
        bookTableBody.appendChild(tr);
    }
}

function changeBookCheckbox(ev) {
    //change numberOfBooksChecked
    if (this.checked) {
        numberOfBooksChecked++;    
    } else {
        numberOfBooksChecked--;
    }

    //change state of header checkbox with id="selectAll"
    selectAll.indeterminate = (numberOfBooksChecked != 0 && numberOfBooksChecked != bookArray.length);
    selectAll.checked = (numberOfBooksChecked == bookArray.length);
}

function changeSelectAll(ev) {
    //check all books, if zero books were checked and uncheck all if any number of books was checked
    let checked = true;
    if (numberOfBooksChecked == 0) {
        numberOfBooksChecked = bookArray.length;
        selectAll.checked = true;
    }
    else {
        numberOfBooksChecked = 0;
        checked = false;
        selectAll.checked = false;
    }
    checkBoxes = document.querySelectorAll(".bookCheckbox");
    checkBoxes.forEach(element => {
        element.checked = checked;
    });
}
//deletes checked books from bookArray and makes rows of the table invisible 
function deleteCheckedBooks() {
    if (numberOfBooksChecked == 0) {
        alert("Select books to delete");
        return
    }

    checkBoxes = document.querySelectorAll(".bookCheckbox");
    checkBoxes.forEach(element => {
        if (element.checked) {
            element.checked = false;
            // making table row invisible
            const tr =  element.parentElement.parentElement;
            tr.className = "display-none";

            //removing the book from the bookArray
            const book = getBookById(tr.id);
            index = bookArray.indexOf(book);
            bookArray.splice(index,1);
        }
    });
    storeBookArray(); //update bookArray in storage
    
    // books deleted - nothing should be checked
    numberOfBooksChecked = 0;
    selectAll.checked = false;
    selectAll.indeterminate = false;
}

function getBookById(id) {
    for (const book of bookArray) {
        if (book.id == id) {
            return book;
        }
    }
}

// called when a row in the book table is clicked
function editBook(e) {
    let id = this.parentElement.id; //id of a book being edited 
    let book = getBookById(id);

    //fill the form
    fillForm(book);

    showForm();
}

function fillForm(book) {
    // title
    document.querySelector("form > p").innerHTML = `Editing Book - id: <span>${(book.id == 0) ? nextID : book.id}</span>`;

    // book data
    for (const key in book) {
        if (key == "id") continue; //skip non-editable property
        document.getElementById(key).value = book[key];
    }

}
// shows form to add new book
function addBook() {
    //fill the form
    fillForm(defaultBook);

    showForm();
}

function buttonCancelClick() {
    hideForm();
}

// fills properties with values from the form
function updateBookFromForm(book) {
    // book data
    for (const key in book) {
        if (key == "id") continue; //skip non-editable property
        book[key] = document.getElementById(key).value;
    }
}

// called when the button "OK" on the form is clicked
function buttonOkClick() {

    //the form can be used to add a new book or to edit an existing one. From the title of the form we can get the book id. If the id equals nextID, then it is a new book
    let bookID = Number(document.querySelector("#editBookForm > p > span").innerText);

    if (nextID == bookID) {
        // adding a new book
        let book = new Book();
        updateBookFromForm(book);
        bookArray.push(book);
        //updating table
        fillBookTable(true);

    } else {
        // editing an existing book
        let book = getBookById(bookID);
        updateBookFromForm(book);

        //updating table
        fillTableRow(document.getElementById(bookID), book);
    }

    storeBookArray(); //update bookArray in storage

    hideForm();
}

function showForm() {
    document.getElementById("editBookForm").style.display = "block";

}

function hideForm() {
    document.getElementById("editBookForm").style.display = "none";
}
 //update bookArray in storage
function storeBookArray() {
    sessionStorage.setItem("bookArray", JSON.stringify(bookArray));
}

// adding event listeners
window.onload = () => { //called when the page loads
    if (sessionStorage.getItem("bookArray") != null) {
        bookArray = JSON.parse(sessionStorage.getItem("bookArray"));//get the bookArray
    }
    fillBookTable();
}

document.getElementById("addBook").addEventListener("click", addBook); //button "Add book"
document.getElementById("deleteBook").addEventListener("click", deleteCheckedBooks); //button "Delete book"
let selectAll = document.getElementById("selectAll");
selectAll.addEventListener("click", changeSelectAll);

document.getElementById("buttonOk").addEventListener("click", buttonOkClick); //button "Ok"
document.getElementById("buttonCancel").addEventListener("click", buttonCancelClick); //button "Cancel"

// filling catalog with test data
fillWithTestDataButton = document.createElement("button");
fillWithTestDataButton.innerText = "Fill with test data";
document.querySelector("nav").appendChild(fillWithTestDataButton);
fillWithTestDataButton.addEventListener("click", () => {
    bookArray = [];
    bookArray.push(new Book("Clive Staples Lewis", "The Lion, the Witch and the Wardrobe", "fantasy", "The Lion, the Witch and the Wardrobe is a fantasy novel for children by C. S. Lewis, published by Geoffrey Bles in 1950. It is the first published and best known of seven novels in The Chronicles of Narnia (1950–1956)"));
    bookArray.push(new Book("Clive Staples Lewis", "Prince Caspian", "fantasy", "Prince Caspian (originally published as Prince Caspian: The Return to Narnia) is a high fantasy novel for children by C. S. Lewis, published by Geoffrey Bles in 1951. It was the second published of seven novels in The Chronicles of Narnia (1950–1956)"));
    storeBookArray(); //update bookArray in storage

    fillBookTable();
});
