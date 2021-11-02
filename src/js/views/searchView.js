import View from "./View";

class SearchView extends View {
    _parentElement = document.querySelector('.search');
    _searchForm = this._parentElement.querySelector('.search__field');
    
    getQuery(){
        const query =  this._searchForm.value;
        this._clearInput();
        return query;
    };

    addHandlerSearch(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            handler();
        });
    };

    _clearInput(){
        this._searchForm.value = '';
    }
};

export default new SearchView();