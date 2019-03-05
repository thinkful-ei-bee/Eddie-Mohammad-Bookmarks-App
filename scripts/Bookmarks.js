// code that defines what a bookmark is
'use strict';
/* global cuid*/

const Bookmark =(function(){
  const create = function(title, url, desc, rating){ // take the user input value and create an object
    return{
      id: cuid(),
      title,
      url,
      desc,
      rating,
      extended: false,
    }; 
  };

  const validateBookmark =  function(title, url, desc, rating){// error checking
    if(title === null || title === ' '){
      throw new TypeError('Title cannot be empty');
    }
    if(url === null || url === ' '){
      throw new TypeError('URL cannot be empty');
    }    
  };

  
  return{
    create,
    validateBookmark,
  }; 
} ());