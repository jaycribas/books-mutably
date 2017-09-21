const url = 'https://mutably.herokuapp.com/books'
const bookDiv = book => {
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
`}

$(document).ready(function(){
  // GET
  getAllBooks()

  function getAllBooks(){
    fetch(url)
      .then(response => response.json())
      .then(booksJson => {
        for(let book of booksJson.books){
          $('div.list-group').append(bookDiv(book))
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  // POST
  $('#new-book').on('submit', event => {
    event.preventDefault()
    $('.form-modal').css('display', 'none')

    let options = {
      method: 'post',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: $('#new-book').serialize()
    }

    return fetch(url, options)
    .then(response => response.json())
    .then(newBook => {
      $('div.list-group').append(bookDiv(newBook))
    })
    .catch(error => {
      console.error(error)
    })
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

  // $(document).on('click', '.delete-book', event => {
  //   let id = $(event.target).closest('div.book-box').attr('id')
  //   $.ajax({
  //     url: url + '/' + id,
  //     type: 'DELETE',
  //     success: function(result){
  //       console.log('Deleted the book! ', result)
  //     }
  //   })
  // })

  // PUT
  $(document).on('click', '.edit-book', event => {
    let id = $(event.target).closest('div.book-box').attr('id')
    $('.form-modal').css('display', 'block')
    $('#edit-book').css('display', 'block')
    $('#new-book').css('display', 'none')
    $('#edit-book').on('submit', event => {
      event.preventDefault()
      $.ajax({
        url: url + id,
        type: 'PUT',
        data: $('#edit-book').serialize(),
        success: function(result){
          console.log('edited the thing!', result)
        }
      })
    })
  })


  $('#add-book').on('click', event => {
    $('.form-modal').css('display', 'block')
    $('#edit-book').css('display', 'none')
    $('#new-book').css('display', 'block')
  })

  $('.close').on('click', event => {
    $('.form-modal').css('display', 'none')
  })
});
