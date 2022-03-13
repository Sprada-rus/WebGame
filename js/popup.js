/**
 * @author SIA
 * @argument Object `settings`
 * @param settings.textContent is string properties
 * @param settings.textTitle is string properties
 * @param settings.textFooter is string properties
 * @param settings.btnHeaderClose is boolean properties
 * @param settings.btnOnContent is array properties
 */
function popup(settings){
    const btnDestroy = !!settings.btnHeaderClose ? '<div class="popup_destroy"><span class="popup-btn-destroy header-close">X</div>' : '';

    const textTitle = '<div class="popup-header">'
    + btnDestroy
    + `<p class="popup-title">${settings.textTitle}</p>`
    + '</div>';

    const blockButton = '';
    if (Array.isArray(settings.btnOnContent) && settings.btnOnContent.length !== 0 ){
        settings.btnOnContent.foreach(i => blockButton += i);
    }

    const textContent = '<div class="popup-content">'
    + settings.textContent
    // + Array.isArray(settings.btnOnContent) && settings.btnOnContent.length !== 0 
    + `<div class="popup-button-block">${blockButton ? blockButton : ''}</div>`
    + '</div>';
    
    let textFooter = '<div class="popup-footer">';
    textFooter += settings.textFooter ? settings.textFooter : '';
    textFooter += '</div>';
    
    const mainPopup = '<div class="popup-main">'
    + textTitle
    + textContent
    + textFooter
    + '</div>';

    const popupNode = document.createElement('div');
    popupNode.classList.add('popup');
    popupNode.classList.add('popup-backside');
    popupNode.insertAdjacentHTML('afterbegin', mainPopup);

    document.body.appendChild(popupNode);

    document.querySelectorAll('.popup-btn-destroy').forEach(
        el => el.addEventListener('click', () => {
            popupNode.classList.remove('popup-open');
            setTimeout(() => document.body.removeChild(popupNode), 800);
        })
    );
    return {
        open(){
            popupNode.classList.add('popup-open');
        },
        close(){
            popupNode.classList.remove('popup-open');
        },
        destroy(){
            document.body.removeChild(document.querySelector('.popup'));
        }
    };
}