import View from "./View";
import previewView from "./previewView";
import icons from 'url:../../img/icons.svg';

class ResultView extends View{
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipe was found!';
    _message = '';
    
    _generateMarkup(){
        return this._data.map(el=>previewView.render(el, false)).join('');
    };
}

export default new ResultView();