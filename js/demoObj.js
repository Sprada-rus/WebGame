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
        let value = parseInt(healthNode.textContent);

        healthNode.textContent = (value + num >= 100 
            ? 100 
            : (value + num < 0 ? 0 : value + num)) + '';
        console.log('Здоровье:' + healthNode.textContent);
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

setValueMenu()





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