console.log("Sanity Check: JS is working!");
// Justin Haaheim [9 minutes ago]
// Strongly suggest you separate out different “kinds” of code: ui rendering code, fetching code, code that represents the data store, code that gets particular dom elements.
//
//
// Justin Haaheim [2 minutes ago]
// @Kelcey Wison I find Punit’s solution particularly elegant. (https://github.com/punitrathore/mutably-starter/blob/punit-solution/public/script.js) He defines UI renderers, ELEMENT grabbers, ACTIONS and fetchers (BookStore). If you were going to refactor your code I’d suggest setting up those same categories and then seeing how far you can get without referring to his solution.
$(document).ready(function(){

  getBooks()

});

const baseUrl = 'http://mutably.herokuapp.com/books/'
// GET	/books	READS all books
function getBooks () {
  fetch(baseUrl)
  .then(resp => resp.json())
  .then(data => {
    console.log(data)
    data.books.forEach(book => {
      $('.list-group').append(`
        <div class='book-div-${book._id}'>
          <div id='${book._id}'>
            <span class='title-${book._id}'>${book.title}</span> by
            <span class='author-${book._id}'>${book.author}</span>
          </div>
          <img src=${book.image} width='50px' height='50px' alt='book cover' />
          <button class='btn btn-primary ${book._id}' onClick='editBook(this)' data-id=${book._id}>Edit</button>
          <button class='hide btn btn-success ${book._id}' onClick='updateBook(this)' data-id=${book._id} data-url=${book.image}>Save</button>
          <button class='btn btn-danger ${book._id}' onClick='deleteBook(this)' data-id=${book._id}>Delete</button>
          <hr>
        </div>
        `)
      })
    })
    .catch(error => console.log(error))
}

function editBook (elem) {
  console.log(elem);
  // get book id
  var id = $(elem).data('id')
  // show Save button and hide Edit button
  $(`.${id}`).toggleClass('hide')
  // function to convert book info into input boxes
  $(`#${id}`).each(function(){
    $(`span.title-${id}`).replaceWith(function(){
      var spanText = $( this ).text()
      return `<input class='title-${id}' type='text' value='${spanText}'>`
    })
    $(`span.author-${id}`).replaceWith(function(){
      var spanText = $( this ).text()
      return `<input class='author-${id}' type="text" value='${spanText}'>`
    })
  })
}

function updateBook (elem) {
  var id = $(elem).data('id')
  var image = $(elem).data('url')
  var title, author
  $(`.${id}`).toggleClass('hide')
  $(`#${id}`).each(function(){
    $(`input.title-${id}`).replaceWith(function(){
      title = $( this ).val()
      return `<span class='title-${id}'>${title}</span>`
    })
    $(`input.author-${id}`).replaceWith(function(){
      author = $( this ).val()
      return `<span class='author-${id}'>${author}</span>`
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
