'use strict';

const store = (function(){
  const addBookmark = function(bookmark){
    this.list.push(bookmark);
  };

  const deleteBookmark = function(id){
    this.list = this.list.filter(item => item.id !== id);
  };

  const setMinimumRating = function(rating){
    this.minimumRating = rating;
  };

  const findById = function(id){
    return this.list.find(item => item.id === id);
  };

  return {
    list: [],
    adding: false,
    minimumRating: 0,
    addBookmark,
    deleteBookmark,
    setMinimumRating,
    findById,
  };
}());