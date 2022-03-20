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
                price = page[elId].price;
                if (demoObj.money < price){
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
            if (!child.classList.contains('group-title') && child.nodeName.toLowerCase !== 'p'){
                child.addEventListener('click', setActionForButton, false);
            }
        }

    } else if (action === 'delete'){

    } else {
        console.error('unkown action');
    }
}