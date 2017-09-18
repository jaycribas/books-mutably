console.log("Sanity Check: JS is working!");

$(document).ready(function(){

  getAllBooks()

  function getAllBooks(){
    $.get('https://mutably.herokuapp.com/books', responseData => {
      console.log("responseData.books (╯°□°）╯︵ ┻━┻", responseData.books)
      for(let book of responseData.books){
        console.log("book.title (╯°□°）╯︵ ┻━┻", book.title)
        $('div.list-group').append(`
          <div id='${book.id}'>
            <ul>
              <img src='${book.image}' height='150'></img>
              <li>${book.title}</li>
              <li>${book.author}</li>
              <li>${book.releaseDate}</li>
            </ul>
          </div>
          `)
      }
    })

  }
});
