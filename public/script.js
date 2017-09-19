$(document).ready(function(){
  // GET
  getAllBooks()

  function getAllBooks(){
    $.get('https://mutably.herokuapp.com/books', responseData => {
      for(let book of responseData.books){
        $('div.list-group').append(`
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
          `)
      }
    })
  }

  // POST
  $('#new-book').on('submit', event => {
    event.preventDefault()
    $.post('https://mutably.herokuapp.com/books', $('#new-book').serialize())
  })

  // DELETE
  $(document).on('click', '.delete-book', event => {
    let id = $(event.target).closest('div.book-box').attr('id')
    $.ajax({
      url: `https://mutably.herokuapp.com/books/${id}`,
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
        url: `https://mutably.herokuapp.com/books/${id}`,
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
