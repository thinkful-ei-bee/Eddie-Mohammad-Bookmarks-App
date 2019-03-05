'use strict';
// calls the thinkful bookmark api, nothing else happens here. Helper functions 
const api = (function(){
  const baseUrl = 'https://thinkful-list-api.herokuapp.com/Eddie-Aamir/'; // from thinkful documentation
  // function here calls the api server

  function getBookmarks(){ // get the bookmarks and return. NO DOM manipulation here
    return fetch(`${baseUrl}bookmarks`);
  }
  //POST method to get the information from the user.
  
  function createBookmark(title, url, desc, rating){
    //making a request body so we can call the api
    const body = JSON.stringify({ //create ajax object using the input value that user wil be providing us with, and convert into JSON string
      title: title,
      url: url,
      desc: desc,
      rating: rating,
    });

    return fetch(`${baseUrl}bookmarks`, { // provide paramters with POST request 
      method: 'POST', // in this request, the method type, headers & body (user inputs)
      headers: new Headers({
        'Content-Type': 'application/json',
      }), // to make sure that the information we get back is of content type JSON
      body: body,
    });
  }

  function deleteBookmark(id){
    return fetch(`${baseUrl}bookmarks/${id}`, {
      method: 'DELETE',
    }); // fetch function defaults to GET method, so we need to provide what method type
  }// delete method sends an empty object


  return{
    getBookmarks,
    createBookmark,
    deleteBookmark,
  };
} () ); //immediately invoking the function here.