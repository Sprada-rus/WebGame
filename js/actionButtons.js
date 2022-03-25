function createPage(pageProperty){
    const property = PAGES[pageProperty];

    if (typeof property === 'undefined'){
        console.error(`Контент для ${pageProperty} не найден`);
        return;
    }
    
    const page = document.querySelector(`.${pageProperty.replace('_', '-')}`);
    // console.log(page);
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
            if('isDisabled' in child && child['isDisabled']()) element.classList.add('disabled'); 
            element.textContent = child['price']?.valueOf() ? `${child['name']} (${child['price']} руб.)` : child['name'];
            element.addEventListener('click', () => {child['action']()});

            return element;
        }
    }

    for (let child in property){
        childrenPage.push(getChildPage(property[child], child));
    }

    const otherGroup = document.createElement('div');
    otherGroup.classList.add('group-btn');

    for (let i of childrenPage){
        if (!Array.isArray(i)) {
            otherGroup.insertAdjacentElement('beforeend', i);
        } else{
            const group = document.createElement('div');
            group.classList.add('group-btn');
            for (let j of i){
                group.insertAdjacentElement('beforeend', j);
            }
            page.insertAdjacentElement('beforeend', group);
        }
    }

    if(otherGroup.children.length === 0){
        otherGroup.remove();
    } else {
        page.insertAdjacentElement('beforeend',otherGroup);
    }
}