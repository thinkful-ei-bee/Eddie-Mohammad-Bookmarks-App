// generate function
'use strict';

/*global $, api, store*/

const bookmarkList = (function(){

  /******* Generate Functions *******/

  function generateBookmark(bookmark){
    // this function generate the html element version of the provided bookmark in a string

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
  }

  /******** Render Function *******/


  /******* Handle Functions *******/

  return {

  };
}());