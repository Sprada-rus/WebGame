//Функция слушателя для меню
const actionOnMenu = (e) => {
    let checkedNode = document.querySelector('input[name="menu"]:checked');
    const content = document.querySelector(`.${checkedNode.defaultValue}-content`);
    if (e.target.nodeName == 'INPUT'){
        content.classList.remove('div-off');

        if (!content.classList.contains('main-content') && content.children.length === 0){
            createPage(`${checkedNode.defaultValue}_content`);
        }
    } else {
        content.classList.add('div-off');
    }
}

const nMenu = document.querySelector('.menu').children[0]

nMenu.addEventListener('click', actionOnMenu, false);