import { API_KEY, API_URL, RES_PER_PAGE } from "./config";
import { getJSON, sendJSON } from "./helper";

export const state = {
    recipe:{},
    search:{
        query:'',
        result: [],
        resultsPerPage: RES_PER_PAGE,
        page:1,
    },
    bookmarks: [],
};

const createRecipeObject=function(data){
    const {recipe} = data.data;
   return{
        id: recipe.id,
        title: recipe.title,
        servings: recipe.servings,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key}),
    };
}

export const loadRecipe = async function(id){
    try{
        //5ed6604591c37cdc054bc886
        const data = await getJSON(`${API_URL}/${id}`)
        state.recipe = createRecipeObject(data);

        //if (!data.ok) throw new Error(`${data.message} (${res.status})`);


        if (state.bookmarks.some(b=>b.id == id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
    } catch(err){
        throw err;
    }
};

export const loadSearchResults = async function(query){
    try{
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`);

        state.search.result = data.data.recipes.map(rec=>{
            return{
                id: rec.id,
                title: rec.title,
                imageUrl: rec.image_url,
                publisher: rec.publisher,
            };
        });
        state.search.page = 1;

    }catch(err){
        throw err;
    };
};

export const getSearchResultPage = function(page = state.search.page){
    state.search.page = page;
    
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.result.slice(start, end);
};

export const updateServings = function(newServing){
    state.recipe.ingredients.forEach(ing=>{
        ing.quantity = ing.quantity * newServing / state.recipe.servings;
    });

    state.recipe.servings = newServing;
};

const presistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
    //add bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    presistBookmarks();
};

export const removeBookmark = function(id){
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    if(id === state.recipe.id) state.recipe.bookmarked = false;

    presistBookmarks();
};

const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);

};

export const uploadRecipe = async function(newRecipe){
    try{

        const ingredients = Object.entries(newRecipe)
        .filter(el=>el[0]
        .startsWith('ingredient') && el[1] !== '')
        .map(el=>{
            const [quantity, unit, description] = el[1].split(',')
            return {quantity: quantity ? +quantity : null, unit, description}
        });
    
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };
        

        const data = await sendJSON(`${API_URL}?key=${API_KEY}`,recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe)
    }catch(err){
        throw new Error(err.message);
    }
};


init();