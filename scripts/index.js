// main function
'use strict';
/* global bookmarkList, store, api, Bookmark*/

$(document).ready(function(){
  bookmarkList.bindEventListeners();
  bookmarkList.render();
  api.getBookmarks()
    .then(res => res.json())
    .then(data => {
      data.forEach(bookmark => store.addBookmark(bookmark));
      bookmarkList.render();
    });

});

// api.createBookmark('google','https://www.google.com','This is google','3')
//   .then(res=>res.json())
//   .then(data =>{
//     return api.getBookmarks();
//   })
//   .then(res=>res.json())
//   .then(data=> console.log(data));