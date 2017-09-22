const url = 'https://mutably.herokuapp.com/books'

const Model = {
  getAllBooks: () => fetch(url).then(res => res.json()),

  addNewBook: () => fetch(url, {
    method: 'post',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: $('#new-book').serialize()
  }).then(res => res.json()),

  deleteBook: id => fetch(url + '/' + id, { method: 'delete' }),

  updateBook: function(){}
}

const DOM = {
  loadBooks: function(json){
    for(let book of json.books){
      $('.row').append(this.bookDivHtml(book))
    }
  },

  bookDivHtml: function(book){
    return `
    <div class='col-md-6 book-box' id='${book._id}'>
      <div class='thumb'>
        <img class='img-thumbnail' src='${book.image}'></img>
      </div>
      <div class='book-details'>
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p>${book.releaseDate}</p>
        <button class='btn btn-sm edit-book'>Edit</button>
        <button class='btn btn-sm delete-book'>Delete</button>
      </div>
    </div>
  `},

  newBookSubmitForm: () => $('#new-book'),

  showNewBookForm: function (){
    $('.form-modal').css('display', 'block')
    $('#edit-book').css('display', 'none')
  },

  showEditBookForm: function(){
    $('#edit-book').css('display', 'block')
    $('.form-modal').css('display', 'none')
  },

  removeBookDiv: id => {
    if(confirm('Are you sure you want to delete this book?'))
      $(`#${id}`).remove()
  },

  hideModal: () => $('.form-modal').css('display', 'none'),

  editBookButton: $('')
}

// handle user events between view/model
const Controller = {
  newBookSubmit: event => {
    event.preventDefault()
    DOM.hideModal()
    Model.addNewBook()
      .then(book => $('.row').append(DOM.bookDivHtml(book)))
      .catch(error => console.log(error))
  },
  deleteBook: event => {
    let bookId = $(event.target).closest('div.book-box').attr('id')
    Model.deleteBook(bookId)
      .then(res => res.json())
      .then(() => DOM.removeBookDiv(bookId))
      .catch(error => console.error(error))
  }
}

$(document).ready(function(){

  // GET index
  Model.getAllBooks()
    .then(json => DOM.loadBooks(json))
    .catch(error => console.error(error))

  // POST
  $('#new-book').on('submit', Controller.newBookSubmit)

  // DELETE
  $(document).on('click', '.delete-book', Controller.deleteBook)

  // PUT
  $(document).on('click', '.edit-book', event => {
    $('.form-modal').css('display', 'block')
    $('#edit-book').css('display', 'block')
    $('#new-book').css('display', 'none')

    var id = $(event.target).closest('div.book-box').attr('id')
    return fetch(url + '/' + id)
      .then(response => response.json())
      .then(book => {
        $("input[type='text'][name='title']").val(book.title)
        $("input[type='text'][name='author']").val(book.author)
        $("input[type='text'][name='releaseDate']").val(book.releaseDate)
        $("input[type='text'][name='image']").val(book.image)

        $('#edit-book').off().on('submit', event => {
          event.preventDefault()
          let options = {
            method: 'put',
            headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: $('#edit-book').serialize()
          }
          return fetch(url + '/' + id, options)
            .then(response => response.json())
            .then(book => {
              $(`#${id}`).replaceWith(DOM.bookDivHtml(book))
              $('.form-modal').css('display', 'none')
            })
            .catch(error => console.error(error))
        })

    })
  })

  $('#add-book').on('click', DOM.showNewBookForm)

  $('.close').on('click', DOM.hideModal)
});
