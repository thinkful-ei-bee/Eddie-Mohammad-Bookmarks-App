// generate function
'use strict';

/*global $, api, store*/

const bookmarkList = (function(){

  /************************************************ Generate Functions ********************************************/
  function generateStar(val){
    let value ='';   
    for(let i = 1; i <= val; i++){         
      value +=('<i class="fa fa-star" aria-hidden="true"></i>');
    }
    return value;    
  }
  function generateBookmark(bookmark){
    // this function generate the html element version of the provided bookmark in a string
    
    if (bookmark.extended){
      return `
      <div data-id= "${bookmark.id}" class="bookmark extended col-12">
        <ul class="col-12">
          <li class="bold col-6" >
            ${bookmark.title}
          </li>
          <li class="col-3" >
            <a href="${bookmark.url}">Visit Site</a>
          </li>
          <div class="description-box col-6">          
            <p>${bookmark.desc}
          </div>                    
          <li class="col-3">       
            ${bookmark.rating > 1 ? generateStar(bookmark.rating) : '<i class="fa fa-star" aria-hidden="true"></i>'}
          </li>                  
        </ul>
        <div class="col-12 centering-text">
            <button class= "js-delete-button">Delete</button>
        </div>      
      </div>`;
    }
    return`
    <div data-id= "${bookmark.id}" class="bookmark">
      <ul>
        <li class="bold">
          ${bookmark.title}
        </li>
        <li>          
          ${bookmark.rating > 1 ? generateStar(bookmark.rating) : '<i class="fa fa-star" aria-hidden="true"></i>'}
        </li>
      </ul>
    </div>`;
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
          <div class= "col-6">
            <label for="title">Title:</label>
            <input id="title" name="title">
          </div>
          <div class= "col-6">
            <label for="url">URL:</label>
            <input id="url" name="url">
          </div>            
         
          <div class="col-12">
            <div class= "col-6">
              <label for="description"></label>
              <textarea id="description" name="description" placeholder="Enter Description here"></textarea>
            </div>
            <div class= "col-6">              
              <label class="float-left block" for="1star">1 star <input class="float-left" type="radio" name="star" value="1star" checked></label>              
              <label class="float-left block" for="2star">2 star <input class="float-left" type="radio" name="star" value="2star" checked></label>              
              <label class="float-left block" for="3star">3 star <input class="float-left" type="radio" name="star" value="3star" checked></label>              
              <label class="float-left block" for="4star">4 star <input class="float-left" type="radio" name="star" value="4star" checked></label>             
              <label class="float-left block" for="5star">5 star <input class="float-left" type="radio" name="star" value="5star" checked></label>
              
            </div>
          </div>          
          <input type="submit" value="Submit">
          <button class="js-cancel-button">Cancel</button>
        </form>`;
    }
    return `<div class= "col-12 centering-text">
      <button id="js-add-bookmark-btn">Add</button>
      <label for="min-rating" value="Minimum Rating"></label>
      <select id="min-rating" name="min-rating" class= "js-select-rating">
        <option value="0">Minimum Rating</option>
        <option value="1">1 Star</option>
        <option value="2">2 Star</option>
        <option value="3">3 Star</option>
        <option value="4">4 Star</option>
        <option value="5">5 Star</option>
      </select>
    </div>`;
  }

  function generateError(){
    return`
    <p class="error">${store.error.message}</p>
    `;
  }

  /************************************************** Render Functions ********************************************/
  function render(){
    // this function renders the information provided by the store
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

  /************************************************** Handle Functions ********************************************/
  function handleAddBookmarkClick(){
    // this function opens the add bookmark form and removes the add button and filter options
    $('.list-controls').on('click','#js-add-bookmark-btn',function(){
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
        .then(handleError)
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
    // this function changes the state of the store so that it is not adding anything
    // when render is run again the submit form will be removed
    $('.list-controls').on('click','.js-cancel-button',function(){
      store.adding = false;
      render();
    });
  }

  function captureId(element){   
    // this function gets the data id from the parameter element
    // data id was added in the generate bookmark function
    // returns id
    return $(element).data('id');
  }

  function handleToggleBookmarkView(){
    // this function toggles the detailed view of a bookmark
    // toggles the bookmarks extended attribute
    $('.bookmark-list').on('click','.bookmark', function(event){
      const id= captureId(event.currentTarget);
      const bookmark= store.findById(id);
      bookmark.extended = !bookmark.extended; // Changed the store
      render();
    });
  }
  
  function handleError(res){
    // this function checks the response from the thinkful api for any errors
    // returns a promise
    if (!res.ok) {
      console.log(`This is the error code: ${res.status}`);
      store.error = {code: res.status};
    }
    if (!res.headers.get('content-type').includes('json')) {
      console.log(`This is the res.statusText: ${res.statusText}`);
      store.error.message = res.statusText;
      return Promise.reject(store.error);
    }
    return res.json();
  }

  function isEmpty(obj){
    // this function checks an object if it is empty
    // returns a boolean
    return Object.hasOwnPropertyNames(obj).length> 0;
  }

  function updateStore(data){
    // this function will update our store based off of the api data from the thinkful api
    // if the data returned is an empty object, we assume it was a DELETE request 
    // otherwise we will assume it was a POST
    
    if (isEmpty(data)){
      // in the case of DELETE
      if(store.error){
        store.error.message= 'Cannot delete an item';
      }
      else{
        //TODO: Find Solution
        // current problem we do not have access to id in order to delete it from our store
        // need to figure out how to access id
        // possible solution, we add a property to our store to keep track of the 
        // id of the element we are focusing on
        //store.deleteBookmark(id);
      }
    }
    else{
      // in the case of POST
      if (store.error){
        store.error.message = data.message;
      }
      else{
        store.addBookmark(data);
        store.adding = false;
      } 
    }
  }

  function handleDeleteBookmarkClick(){ //event delegation
    // this function will delete a bookmark
    // find the id associated with the bookmark to be deleted
    // call the api to delete it
    // from the response, make sure no errors occured
    // delete the bookmark from store
    // re render
    // clear the error in the store
    $('.bookmark-list').on('click', '.js-delete-button', function(event){      
      const id = captureId($(event.currentTarget).parents('div'));
      api.deleteBookmark(id)
        .then(handleError)
        .then((data) => {
          console.log(data,typeof data);
          if(store.error){
            store.error.message= 'Cannot delete an item';
            console.log(store.error.message);
          } // due to asyn nature, api needs to send a OK status before deleting from the store.
          store.deleteBookmark(id);
          render();
          store.error = null;
        });
    });
  }
  
  function handleMinimumRatingChange(){ // event delegation
    // this function keeps track of the minimum rating change
    $('.list-controls').on('change', 'select', function(event){
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