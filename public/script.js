const url = 'https://mutably.herokuapp.com/books'

const bookDiv = book => {
  return `
  <div class='book-box' id='${book._id}'>
    <div class='thumb'>
      <img class='img-thumbnail' src='${book.image}'></img>
    </div>
    <div class='book-details'>
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <p>${book.releaseDate}</p>
      <button class='delete-book'>Delete</button>
      <button class='edit-book'>Edit</button>
    </div>
  </div>
`}

$(document).ready(function(){
  // GET
  fetch(url, { method: 'get', 'Content-Type': 'application/json' })
    .then(function(response){
      return response.json()
    })
    .then(function(booksJson){
      for(let book of booksJson.books){
        $('div.list-group').append(bookDiv(book))
      }
    })
    .catch(function(error){
      console.error(error)
    })

  // POST
  $('#new-book').on('submit', event => {
    event.preventDefault()
    $.post(url, $('#new-book').serialize())
  })

  // DELETE
  $(document).on('click', '.delete-book', event => {
    let id = $(event.target).closest('div.book-box').attr('id')
    $.ajax({
      url: url + id,
      type: 'DELETE',
      success: function(result){
        console.log('Deleted the book! ', result)
      }
    })
  })

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
