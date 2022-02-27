const demoObj = {
    name_obj: 'Василий',
    age_obj: 24,
    status_obj: 'Бомж',
    vehicle_obj: null,
    build_obj: null,
    rating_obj: 0,
    health: 50,
    money: 0,
    condition: 50,
    changeHealth: (num) => {
        const healthNode = document.querySelector('#health_indication');
        demoObj.health = (demoObj.health + num >= 100 
            ? 100 
            : (demoObj.health + num <= 0 ? 0 : demoObj.health + num));
        healthNode.textContent = demoObj.health + '';
    }
}


const setValueMenu = () => {
    let mainContent = document.querySelector('.main-content');

    for(let el of mainContent.children){
        let elementId = el.children[1].id;

        let nodeValue = demoObj[elementId] === null ? 'Пусто' : demoObj[elementId];
        document.querySelector(`#${elementId}`).textContent = nodeValue;
    }
}

const setValueOnIndicators = () => {
    const iHealth = document.querySelector('#health_indication');
    const iCondition = document.querySelector('#condition_indication');
    const iMoney = document.querySelector('#money_indication');

    iHealth.textContent = demoObj.health;
    iCondition.textContent = demoObj.condition;
    iMoney.textContent = demoObj.money;
}

setValueMenu();
setValueOnIndicators();



//Хранение объектов для каждой кнопки в разделах
const PAGES = {
    health_content:{
        //Здоровье: Услуги
        first_service : {
            price: 0,
            action: () => {
                demoObj.changeHealth(5);                
            },
        },
        second_service : {
            price: 0,
            action: () => {
                demoObj.changeHealth(8);
            },
        },
        third_service : {
            price: 0,
            action: () => {
                demoObj.changeHealth(11);
            },
        },
        fourth_service : {
            price: 0,
            action: () => {
                demoObj.changeHealth(12);
            },
        },
        fifth_service : {
            price: 0,
            action: () => {
                demoObj.changeHealth(50);
            },
        },
        // Здоровье: Действие
        first_action : {
            necessary_item: 'Кросовки',
            action: () => {
                demoObj.changeHealth(5);
            }
        }
    }
}