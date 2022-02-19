const addActionForGroup = (content) => {
    for(let i = 0; i < content.children.length; i++){
        if(content.children[i].nodeName.toLowerCase() === 'div' && content.children[i].classList.contains('group-btn')){
            checkContent(content.children[i], 'add');
        }
    }
}

// function addActionForGroup(content){
//     console.log(content.children)
// }

const actionOnMenu = (e) => {
    let checkedNode = document.querySelector('input[name="menu"]:checked');
    const content = document.querySelector(`.${checkedNode.defaultValue}-content`);
    if (e.target.nodeName == 'INPUT'){
        content.classList.remove('div-off');
        addActionForGroup(content);
    } else {
        content.classList.add('div-off');
    }
}

const nMenu = document.querySelector('.menu').children[0]

nMenu.addEventListener('click', actionOnMenu, false);