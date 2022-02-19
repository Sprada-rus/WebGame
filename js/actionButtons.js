const setActionForButton = (e) => {
    const elId = e.target.id
    const {action, price} = healthPage[elId];

    if(price && demoObj.money < price){
        alert('Денег у тебя нет!');
    } else {
        action();
    }
}

/*
* Проверяем, что имеено требуется произвести блоком
*/
const checkContent = (content, action) => {
    if (action === 'add'){
        // console.log(content);
        for(let i = 0; i < content.children.length; i++){
            const child = content.children[i];
            if (!child.classList.contains('group-title') && child.nodeName.toLowerCase !== 'p'){
                child.addEventListener('click', setActionForButton, false);
            }
        }

    } else if (action === 'delete'){

    } else {
        console.error('unkown action');
    }
}