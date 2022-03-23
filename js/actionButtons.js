//Функция для взаимодействия с кнопками
const setActionForButton = (e) => {
    const elId = e.target.id;
    const namePage = e.target.parentElement.parentElement.classList[0].replace('-', '_');
    const page = PAGES[namePage];
    if(!page || !page[elId]){
        return;
    }else{
        switch(namePage){
            case 'health_content':
                let {price, necessary_item} = page[elId];
                if (demoObj.money < price){
                    alert('Денег не хвататет!');
                } else if (necessary_item && !demoObj.vehicle_obj.has(necessary_item)){
                    alert(`Нужно приобрести ${necessary_item}`);
                } else {
                    page[elId].action();
                }
                break;
            case 'fun_content':
                let funPrice = page[elId].price;
                if (demoObj.money < funPrice){
                    alert('Денег не хвататет!');
                } else {
                    page[elId].action();
                }
                break;
            case 'work_content':
                let {needEducation, needHousing} = page[elId];
                const alertMessage = [];
                
                if(needEducation) alertMessage.push(needEducation);
                if(needHousing) alertMessage.push(needHousing);

                if(alertMessage.length > 0){
                    alert(`Нехватает:\n${alertMessage.join('\n')}`);
                } else {
                    page[elId].action();
                }
                break;
            case 'item_content':
                let itemPrice = page[elId].price;

                demoObj.money < itemPrice ? alert('Денег не хвататет!') : page[elId].action();
                break;
            case 'social_content':
                let socialPrice = page[elId].price;

                demoObj.money < socialPrice ? alert('Денег не хвататет!') : page[elId].action();
                break;
            default:
                console.log('Что ты выбрал?');
        }
    }

    
}

/*
* Проверяем, что имеено требуется произвести блоком
*/
const checkContent = (content, action) => {
    if (action === 'add'){
        for(let i = 0; i < content.children.length; i++){
            const child = content.children[i];
            if (!child.classList.contains('group-title')){
                child.addEventListener('click', setActionForButton, false);
            }
        }

    } else if (action === 'delete'){

    } else {
        console.error('unkown action');
    }
}

function createPage(pageProperty){
    const property = PAGES[pageProperty];

    if (typeof property === 'undefined'){
        console.error(`Контент для ${pageProperty} не найден`);
        return;
    }
    
    const page = document.querySelector(`.${pageProperty.replace('_', '-')}`);
    console.log(page);
    const childrenPage = [];
    const getChildPage = (child, code = null) => {
        if(child?.name_group){
            const children = [];
            const keys = Object.keys(child);
            
            //Создаем заголовок
            const groupTitle = document.createElement('div');
            groupTitle.classList.add('group-title');
            groupTitle.textContent = child['name_group'];
            children.push(groupTitle);
            keys.shift();
            
            //С помощью рекурсии создаем остальные элементы
            for(let i of keys){
                children.push(getChildPage(child[i], i));
            }

            return children;
        } else {
            const element = document.createElement('div');
            element.classList.add('btn');
            element.id = code;
            element.textContent = child['price']?.valueOf() ? `${child['name']} (${child['price']} руб.)` : child['name'];
            element.addEventListener('click', child['action']);

            return element;
        }
    }

    for (let child in property){
        childrenPage.push(getChildPage(property[child], child));
    }

    for (let i of childrenPage){
        if (!Array.isArray(i)) {
            page.insertAdjacentElement('beforeend',i);
        } else{
            const group = document.createElement('div');
            group.classList.add('group-btn');
            for (let j of i){
                group.insertAdjacentElement('beforeend', j);
            }

            page.insertAdjacentElement('beforeend', group);
        }
    }
}