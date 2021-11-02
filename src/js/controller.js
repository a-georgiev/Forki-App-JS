import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

if(module.hot){
  module.hot.accept();
};


const controlRecipes = async function(){
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //1) Loading recipe
    resultView.update(model.getSearchResultPage());

    //2)update bookmark views moved forward cuz error 
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    
    const {recipe} = model.state;
    //3) Rendering Recipe
    recipeView.render(recipe);
    
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

const controlSearchResults = async function(){
  try{
    resultView.renderSpinner();

    //1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) LOAD search results
    await model.loadSearchResults(query);

    //3)render
    resultView.render(model.getSearchResultPage());

    //4)render initial pagination buttons
    paginationView.render(model.state.search);
  }catch(err){
    console.log(err);
  }
};

const controlPagination = function(goToPage){
  resultView.render(model.getSearchResultPage(goToPage));

  paginationView.render(model.state.search);
};

const cotrolServings = function(newServings){
  // model.updateServings(newServings);

  // //recipeView.render(model.state.recipe);
  // recipeView.update(model.state.recipe);
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function(){
  //1 add/remove bookmarks
  if (!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }
  //2 update recipeView
  recipeView.update(model.state.recipe);

  //3 render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
};

const controlAddRecipe =async function(newRecipe){
  try{
    //add new recipe
    await model.uploadRecipe(newRecipe);
    
    //render newly added recipe
    recipeView.render(model.state.recipe);

    //close form
    addRecipeView.toggleWinndow();

    //render bookmark view 
    bookmarksView.render(model.state.recipe);

    //change ID in URL
    window.history.pushState(null,'',`#${model.state.recipe.id}`);
  }catch(err){
    addRecipeView.renderError(err.message)
  }
};

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServingsUpdate(cotrolServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

const clearBookmarks = function(){
  localStorage.clear('bookmarks');
};

// clearBookmarks();