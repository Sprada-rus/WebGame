/**
 * @author SIA
 * @argument Object `settings`
 * @param settings.textContent is string properties
 * @param settings.textTitle is string properties
 * @param settings.textFooter is string properties
 * @param settings.btnHeaderClose is boolean properties
 * @param settings.btnOnContent is node array properties
 */
export function Popup(settings){
    const btnDestroy = !!settings.btnHeaderClose ? '<div class="popup_destroy"><span class="popup-btn-destroy header-close">X</div>' : '';
    
    const textTitle = '<div class="popup-header">'
    + btnDestroy
    + `<p class="popup-title">${settings.textTitle}</p>`
    + '</div>';
    
    const textContent = '<div class="popup-content">'
    + settings.textContent
    + `<div class="popup-button-block"></div>`
    + '</div>';
    
    let textFooter = '<div class="popup-footer">';
    textFooter += settings.textFooter ? settings.textFooter : '';
    textFooter += '</div>';

    const mainPopup = '<div class="popup-main">'
    + textTitle
    + textContent
    + textFooter
    + '</div>';

    this.popupNode = document.createElement('div');
    this.popupNode.classList.add('popup');
    this.popupNode.classList.add('popup-backside');
    this.popupNode.insertAdjacentHTML('afterbegin', mainPopup);

    document.body.appendChild(this.popupNode);

    document.querySelectorAll('.popup-btn-destroy').forEach(
        el => el.addEventListener('click', () => {
            this.popupNode.classList.remove('popup-open');
            setTimeout(() => document.body.removeChild(popupNode), 800);
        })
    );

    if (Array.isArray(settings.btnOnContent) && settings.btnOnContent.length !== 0){
        for (let element of settings.btnOnContent){
            if(element?.ELEMENT_NODE === 1){
                this.popupNode.childNodes[0].childNodes[1].lastChild.appendChild(element);
            }
        }
    }
}

Popup.prototype = {
    open: function(){
        this.popupNode.classList.add('popup-open');
    },
    close: function(){
        this.popupNode.classList.remove('popup-open');
    },
    destroy: function(){
        this.popupNode.classList.remove('popup-open');
        setTimeout(() => document.body.removeChild(this.popupNode), 200);
    },

    get popup() {return this.popupNode}
}