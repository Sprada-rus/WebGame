const demoObj = {
    name_obj: 'Василий',
    age_obj: 24,
    status_obj: 'Бомж',
    vehicle_obj: null,
    build_obj: null,
    rating_obj: 0,
    healt: 50,
    money: 0,
    condition: 50
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



//Хранение объектов для каждого пункута меню
const PAGES = {
    health_content:{
        first_service : {
            price: 0,
            action: () => {
                demoObj.healt += 5;
                console.log('Здоровье:' + demoObj.healt);
            },
        },
        second_service : {
            price: 0,
            action: () => {
                demoObj.healt += 8;
                console.log('Здоровье:' + demoObj.healt);
            },
        },
        third_service : {
            price: 0,
            action: () => {
                demoObj.healt += 11;
                console.log('Здоровье:' + demoObj.healt);
            },
        },
        fourth_service : {
            price: 0,
            action: () => {
                demoObj.healt += 12;
                console.log('Здоровье:' + demoObj.healt);
            },
        },
        fifth_service : {
            price: 0,
            action: () => {
                demoObj.healt += 50;
                console.log('Здоровье:' + demoObj.healt);
            },
        }
    }
}