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

  deleteBook: function(){},

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

  hideModal: () => $('.form-modal').css('display', 'none'),

  editBookButton: $('')
}

// handle user events between view/model
const Controller = {
  newBookSubmit: event => {
    let book = $('#new-book').serialize()
    return Model.addNewBook()
  }
}

$(document).ready(function(){

  // GET index
  Model.getAllBooks(url)
    .then(json => {
      DOM.loadBooks(json)
    })
    .catch(error => {
      console.error(error)
    })

  // POST

  $('#new-book').on('submit', event => {
    event.preventDefault()
    DOM.hideModal()
    Model.addNewBook()
      .then(book => $('.row').append(DOM.bookDivHtml(book)))
      .catch(error => console.log(error))
  })

  // DELETE
  $(document).on('click', '.delete-book', event => {
    let id = $(event.target).closest('div.book-box').attr('id')
    return fetch(url + '/' + id, { method: 'delete' })
      .then(response => response.json())
      .then(book => {
        $(`#${id}`).remove()
        alert(`Deleted the book ${book.title}`)
      })
      .catch(error => console.error(error))
  })

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
              $(`#${id}`).replaceWith(bookDiv(book))
              $('.form-modal').css('display', 'none')
            })
            .catch(error => console.error(error))
        })

    })
  })

  $('#add-book').on('click', DOM.showNewBookForm)

  $('.close').on('click', event => {
    $('.form-modal').css('display', 'none')
  })
});
