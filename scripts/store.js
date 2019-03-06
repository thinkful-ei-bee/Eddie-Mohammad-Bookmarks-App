'use strict';

const store = (function(){
  // these function calls the api
  const addBookmark = function(bookmark){
    this.list.push(bookmark);
  };

  const deleteBookmark = function(id){
    this.list = this.list.filter(item => item.id !== id);
  };

  const setMinimumRating = function(rating){
    this.minimumRating = rating;
  };

  const findById = function(id){ // returns the object
    return this.list.find(item => item.id === id);
  };

  return {
    list: [],
    adding: false,
    error: null,
    minimumRating: 0,
    addBookmark,
    deleteBookmark,
    setMinimumRating,
    findById,
  };
}());