const url = 'https://mutably.herokuapp.com/books'

$(document).ready(function(){

  const Model = {
    getAllBooks: () => fetch(url).then(res => res.json()),

    addBook: () => fetch(url, {
      method: 'post',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: Controller.addBookDetails()
    }).then(res => res.json()),

    deleteBook: id => fetch(url + '/' + id, { method: 'delete' })
    .then(res => res.json())
,

    editBook: id => fetch(url + '/' + id, {
      method: 'put',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: Controller.editBookDetails()
    }).then(res => res.json())
,

    bookDetails: id => fetch(url + '/' + id)
    .then(res => res.json())
  }

  const DOM = {
    loadBooks: books => {
      for(let book of books)
        $('.row').append(DOM.bookDivHtml(book))
    },

    bookDivHtml: book => `
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
    `,

    addForm: $('#new-book'),

    showNewBookForm: () => {
      $('.form-modal').css('display', 'block')
      DOM.addForm.css('display', 'block')
      $('#edit-book').css('display', 'none')
      $('input[type="text"]').val('')
    },

    showEditBookForm: id => {
      $('.form-modal').css('display', 'block')
      DOM.addForm.css('display', 'none')
      $('#edit-book').css('display', 'block')

      Model.bookDetails(id)
      .then(book => {
        $("input[type='text'][name='title']").val(book.title)
        $("input[type='text'][name='author']").val(book.author)
        $("input[type='text'][name='releaseDate']").val(book.releaseDate)
        $("input[type='text'][name='image']").val(book.image)
      })
    },

    removeBookDiv: id => {
      $(`#${id}`).remove()
    },

    hideModal: () => $('.form-modal').css('display', 'none'),

    row: $('.row'),

    targetId: book => $(book).closest('div.book-box').attr('id'),

    editForm: $('#edit-book'),

    updateBookDiv: book => {
      $(`#${book._id}`).replaceWith(DOM.bookDivHtml(book))
      $('.form-modal').css('display', 'none')
    }

  }

  // handle user events between view/model
  const Controller = {
    initializeDOM: () => {
      Model.getAllBooks()
      .then(json => DOM.loadBooks(json.books))
      .catch(error => console.error(error))
    },

    addBook: event => {
      event.preventDefault()
      DOM.hideModal()
      Model.addBook()
      .then(book => DOM.row.append(DOM.bookDivHtml(book)))
      .catch(error => console.error(error))
    },

    deleteBook: event => {
      let id = DOM.targetId(event.target)
      if(confirm('Are you sure you want to delete this book?')){
        Model.deleteBook(id)
        .then(() => DOM.removeBookDiv(id))
        .catch(error => console.error(error))
      }
    },

    editBook: event => {
      let id = DOM.targetId(event.target)
      DOM.showEditBookForm(id)
      DOM.editForm.off().on('submit', event => {
        event.preventDefault()

        Model.editBook(id)
        .then(book => DOM.updateBookDiv(book))
        .catch(error => console.error(error))
      })
    },

    addBookDetails: () => DOM.addForm.serialize(),

    editBookDetails: () => DOM.editForm.serialize(),

    eventListeners: () => {
      // Modal
      $('#add-book').on('click', DOM.showNewBookForm)
      $('.close').on('click', DOM.hideModal)

      // POST
      DOM.addForm.on('submit', Controller.addBook)

      // DELETE
      $(document).on('click', '.delete-book', Controller.deleteBook)

      // PUT
      $(document).on('click', '.edit-book', Controller.editBook)
    }
  }

  Controller.initializeDOM()
  Controller.eventListeners()
});
