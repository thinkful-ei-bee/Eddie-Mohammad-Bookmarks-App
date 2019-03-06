// generate function
'use strict';

/*global $, api, store*/

const bookmarkList = (function(){

  /******* Generate Functions *******/

  function generateBookmark(bookmark){
    // this function generate the html element version of the provided bookmark in a string
    if (bookmark.extended){
      return `
      <li class="bookmark extended">
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
          <button>Delete</button>
        </ul>
      </li>`;
    }
    return`
    <li class="bookmark">
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

  function generateExtendedViewBookmark(bookmark){
    // this function generates the extended view of the provided bookmark

  }

  function generateSubmitForm(){
    // this function generates the form to add the bookmark
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
          <button>Cancel</button>
        </form>`;
    }
    return `<button id="js-add-bookmark-btn">Add</button>
    <select>
      <option>Minimum Rating</option>
      <option value="1">1 Star</option>
      <option value="2">2 Star</option>
      <option value="3">3 Star</option>
      <option value="4">4 Star</option>
      <option value="5">5 Star</option>
    </select>`;
  }

  /******** Render Function *******/
  function render(){
    let list = [...store.list];
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
        .then(res=>res.json())
        .then(data =>{
          store.addBookmark(data);
          store.adding = false;
          render();
        });
    });
  }

  function bindEventListeners(){
    handleAddBookmarkClick();
    handleNewBookmarkSubmit();
  }
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());