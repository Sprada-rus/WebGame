const actionOnMenu = (e) => {
    let checkedNode = document.querySelector('input[name="menu"]:checked');
    
    if (e.target.nodeName == 'INPUT'){
        document.querySelector(`.${checkedNode.defaultValue}-content`).classList.remove('div-off')
    } else {
        document.querySelector(`.${checkedNode.defaultValue}-content`).classList.add('div-off')
    }
}

const nMenu = document.querySelector('.menu').children[0]

nMenu.addEventListener('click', actionOnMenu, false);