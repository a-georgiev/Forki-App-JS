import View from "./View";
import previewView from "./previewView";
import icons from 'url:../../img/icons.svg';

class BookamrksView extends View{
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet!';
    _message = '';
    
    addHandlerRender(handler){
        window.addEventListener('load', handler);
    };

    _generateMarkup(){
        return this._data.map(el=>previewView.render(el, false)).join('');
    };
}

export default new BookamrksView();