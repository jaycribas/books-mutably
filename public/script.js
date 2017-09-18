console.log("Sanity Check: JS is working!");

$(document).ready(function(){

  getAllBooks()

  function getAllBooks(){
    $.get('https://mutably.herokuapp.com/books', responseData => {
      for(let book of responseData.books){
        $('div.list-group').append(`
          <div class='book-box' id='${book.id}'>
            <div class='thumb'>
              <img class='img-thumbnail' src='${book.image}'></img>
            </div>
            <div class='book-details'>
              <h3>${book.title}</h3>
              <p>${book.author}</p>
              <p>${book.releaseDate}</p>
            </ul>
          </div>
          `)
      }
    })

  }
});
