// generate function
'use strict';

/*global $, api, store*/

const bookmarkList = (function(){

  /******* Generate Functions *******/

  function generateBookmark(bookmark){
    // this function generate the html element version of the provided bookmark in a string
    if (bookmark.extended){
      return `
      <li data-id= "${bookmark.id}" class="bookmark extended">
        <ul>
          <li>
            ${bookmark.title}
          </li>
          <li>
            ${bookmark.rating}
          </li>
          <li>
            ${bookmark.desc}
          </li>
          <li>
            <a href="${bookmark.url}">Visit Site</a>
          </li>
          <button class= "js-delete-button">Delete</button>
        </ul>
      </li>`;
    }
    return`
    <li data-id= "${bookmark.id}" class="bookmark">
      <ul>
        <li>
          ${bookmark.title}
        </li>
        <li>
          ${bookmark.rating}
        </li>
      </ul>
    </li>`;
  }

  function generateBookmarkList(list){
    // this function generates one string
    const listCopy = list.map(item => generateBookmark(item));
    return listCopy.join('');
  }

  function generateMenu(){
    // this function generates the add bookmark button and dropdown. Returns html in a string
    if (store.adding){
      return  `
      <form class="js-add-bookmark-form">
          <label for="title">Title:</label>
          <input id="title" name="title">
          <label for="url">URL:</label>
          <input id="url" name="url">
          <label name="description">Description:</label>
          <textarea id="description" name="description"></textarea>
          <label for="1star">1 star</label>
          <input type="radio" name="star" value="1star" checked>
          <label for="2star">2 star</label>
          <input type="radio" name="star" value="2star" checked>
          <label for="3star">3 star</label>
          <input type="radio" name="star" value="3star" checked>
          <label for="4star">4 star</label>
          <input type="radio" name="star" value="4star" checked>
          <label for="5star">5 star</label>
          <input type="radio" name="star" value="5star" checked>
          <input type="submit" value="Submit">
          <button class="js-cancel-button">Cancel</button>
        </form>`;
    }
    return `<button id="js-add-bookmark-btn">Add</button>
    <select class= "js-select-rating">
      <option value="0">Minimum Rating</option>
      <option value="1">1 Star</option>
      <option value="2">2 Star</option>
      <option value="3">3 Star</option>
      <option value="4">4 Star</option>
      <option value="5">5 Star</option>
    </select>`;
  }

  function generateError(){
    return`
    <p class="error">${store.error.message}</p>
    `;
  }

  /******** Render Function *******/
  function render(){
    if (store.error){
      $('.error-display').html(generateError());
    }
    else{
      $('.error-display').html('');
    }
    let list = [...store.list];
    list = list.filter(bookmark => bookmark.rating >= store.minimumRating);
    const bookmarkListString = generateBookmarkList(list);
    $('.bookmark-list').html(bookmarkListString);
    $('.list-controls').html(generateMenu());
  }

  /******* Handle Functions *******/
  function handleAddBookmarkClick(){
    // this function opens the add bookmark form and removes the add button and filter options
    $('.list-controls').on('click','#js-add-bookmark-btn',function(event){
      store.adding = true;
      render();
    });
  }

  function handleNewBookmarkSubmit(){
    // this function gets the user data and creates a bookmark and then add it to bookmark list
    $('.list-controls').on('submit','.js-add-bookmark-form',function(event){
      event.preventDefault();
      // get values
      // create using our api
      // add to store
      // change state of store
      // render
      const title = $('#title').val();
      const url = $('#url').val();
      const desc = $('#description').val();
      const rating = $('input[name=star]:checked').val();
      $('#title').val('');
      $('#url').val('');
      $('#description').val('');
      $('input[name=star]:checked').val('');
      api.createBookmark(title,url,desc,rating)
        .then(res=>{
          if (!res.ok) {
            console.log(`This is the error codet: ${res.status}`);
            store.error = {code: res.status};
          }
          if (!res.headers.get('content-type').includes('json')) {
            console.log(`This is the res.statusText: ${res.statusText}`);
            store.error.message = res.statusText;
            return Promise.reject(store.error);
          }
          return res.json();
        })
        .then(data =>{
          if (store.error){
            console.log(`This is the error message: ${data.message}`);
            store.error.message = data.message;
            // display on screen what the error was
            console.log(store.error);
          }else{
            store.addBookmark(data);
            store.adding = false;
          }
          render();
          store.error=null;
        });
    });
  }

  function handleCancelClick(){
    $('.list-controls').on('click','.js-cancel-button',function(event){
      store.adding = false;
      render();
    });
  }

  function captureId(element){   
    return $(element).data('id');
  }

  function handleToggleBookmarkView(){
    $('.bookmark-list').on('click','.bookmark', function(event){
      // console.log(event.currentTarget);
      const id= captureId(event.currentTarget);
      const bookmark= store.findById(id);
      bookmark.extended = !bookmark.extended; // Changed the store
      render();
    });
  }

  function handleDeleteBookmarkClick(){ //event delegation
    $('.bookmark-list').on('click', '.js-delete-button', function(event){      
      const id = captureId($(event.currentTarget).parents('li'));
      api.deleteBookmark(id)
        .then(res => res.json())
        .then(() =>{ // due to asyn nature, api needs to send a OK status before deleting from the store.
          store.deleteBookmark(id);
          render();
        });
    });
  }
  
  function handleMinimumRatingChange(){ // event delegation
    $('.list-controls').on('change', 'select', function(event){
      console.log('rating changed');
      console.log($(this).val());
      store.setMinimumRating( $(this).val());
      render();      
    });
  }

  function bindEventListeners(){
    handleAddBookmarkClick();
    handleCancelClick();
    handleNewBookmarkSubmit();
    handleToggleBookmarkView();
    handleDeleteBookmarkClick();
    handleMinimumRatingChange();
  }
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());