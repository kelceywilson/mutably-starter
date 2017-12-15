console.log("Sanity Check: JS is working!");
// Deploy on heroku
//
// @Kelcey Wison I find Punit’s solution particularly elegant. (https://github.com/punitrathore/mutably-starter/blob/punit-solution/public/script.js) He defines UI renderers, ELEMENT grabbers, ACTIONS and fetchers (BookStore). If you were going to refactor your code I’d suggest setting up those same categories and then seeing how far you can get without referring to his solution.
$(document).ready(function(){
  getBooks()
});

// separate out different “kinds” of code: ui rendering code, fetching code, code that represents the data store, code that gets particular dom elements.

const baseUrl = 'https://mutably.herokuapp.com/books/'
// GET	/books	READS all books
function getBooks () {
  fetch(baseUrl)
  .then(resp => resp.json())
  .then(data => {
    data.books.forEach(book => {
      $('.list-group').prepend(`
        <div class='book-div-${book._id}'>
          <div class='single-book' id='${book._id}'>
            <div class='edit-layout-${book._id} row'>
              <div>
                <span class='title-${book._id}'>${book.title}</span>
                <span>by</span>
                <span class='author-${book._id}'>${book.author}</span>
                <button class='edit-button ${book._id}' onClick='editBook(this)' data-id=${book._id} data-url=${book.image}>Edit</button>
                <button class='delete-button ${book._id}' onClick='deleteBook(this)' data-id=${book._id}>Delete</button>
              </div>
              <img class='image-${book._id}' src=${book.image} alt='book cover' />
            </div>
          </div>
          <button class='hide save-button ${book._id}' onClick='updateBook(this)' data-id=${book._id} data-url=${book.image}>Save</button>
          <hr>
        </div>
        `)
      })
    })
    .catch(error => console.log(error))
}

function addBook () {
  const title = $('.title').val()
  const author = $('.author').val()
  const image = $('.image').val()
  const book = 'newBook'
  console.log(title, author, image);
  $('.list-group').prepend(`
    <div class='book-div-${book}'>
      <div class='single-book' id='${book}'>
        <div class='edit-layout row'>
          <div>
            <span class='title-${book}'>${title}</span>
            <span>by</span>
            <span class='author-${book}'>${author}</span>
            <button class='edit-button ${book}' onClick='editBook(this)' data-id=${book} data-url=${image}>Edit</button>
            <button class='delete-button ${book}' onClick='deleteBook(this)' data-id=${book}>Delete</button>
          </div>
          <img class='image-${book}' src=${image} alt='book cover' />
        </div>
      </div>
      <button class='hide save-button ${book}' onClick='updateBook(this)' data-id=${book} data-url=${image}>Save</button>
      <hr>
    </div>
  `)
  fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify({
      title,
      author,
      image
    }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(console.log)
}

function editBook (elem) {
  // get book id
  var id = $(elem).data('id')
  var url = $(elem).data('url')
  // show Save button and hide Edit button
  $(`.${id}`).toggleClass('hide')
  $(`.edit-layout-${id}`).toggleClass('row')
  // function to convert book info into input boxes
  $(`#${id}`).each(function(){
    $(`span.title-${id}`).replaceWith(function(){
      var spanText = $( this ).text()
      return `<input class='edit title-${id}' type='text' value='${spanText}'>`
    })
    $(`span.author-${id}`).replaceWith(function(){
      var spanText = $( this ).text()
      return `<input class='edit author-${id}' type="text" value='${spanText}'>`
    })
    $(`img.image-${id}`).replaceWith(function(){
      return `<input class='edit image-${id}' type="text" value='${url}'>`
    })
  })
}

function updateBook (elem) {
  var id = $(elem).data('id')
  var image = $(elem).data('url')
  var title, author
  $(`.${id}`).toggleClass('hide')
  $(`.edit-layout-${id}`).toggleClass('row')
  $(`#${id}`).each(function(){
    $(`input.title-${id}`).replaceWith(function(){
      title = $( this ).val()
      return `<span class='title-${id}'>${title}</span>`
    })
    $(`input.author-${id}`).replaceWith(function(){
      author = $( this ).val()
      return `<span class='author-${id}'>${author}</span>`
    })
    $(`input.image-${id}`).replaceWith(function(){
      image = $( this ).val()
      return `<img class='image-${id}' src=${image} width='50px' height='50px' alt='book cover' />`
    })
  })
  fetch(baseUrl + id, {
    method: 'PUT',
    body: JSON.stringify({
      title,
      author,
      image
    }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(console.log)
}

function deleteBook (elem) {
  var id = $(elem).data('id')

  fetch(baseUrl + id, {
    method: 'DELETE'
  })
  .then(console.log)

  $(`.book-div-${id}`).remove()
}
