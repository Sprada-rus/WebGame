import { notification } from "./notification.js";
import { Player } from "./player.js";
import { randomIntRange } from "./randomHelp.js";
import { Popup, PopupForm } from "./popup.js";

let PLAYER = null;

//Первая загрузка страницы, проставление значений в разделе "Меню"
const setValueMenu = () => {
    let mainContent = document.querySelector('.main-content');

    for(let el of mainContent.children){
        let indexBefore = el.children[1].id.indexOf('_');
        let elementId = el.children[1].id.substring(0, indexBefore);
        let nodeValue = '';
        // console.log(document.querySelector(`#${elementId}_obj`))
        if(PLAYER[elementId] instanceof Set){
            nodeValue = PLAYER[elementId].size > 0 ? Array.from(PLAYER[elementId]).join(', ') : 'Пусто';
        }else{
            nodeValue = PLAYER[elementId] === null ? 'Пусто' : PLAYER[elementId];
        }

        document.querySelector(`#${elementId}_obj`).innerHTML = nodeValue;
    }
}

//Проставление значения для индикаторов "Здоровье, деньги, настроение"
const setValueOnIndicators = () => {
    const iHealth = document.getElementById('health_indication');
    const iCondition = document.getElementById('sentiment_indication');
    const iMoney = document.getElementById('money_indication');

    iHealth.innerHTML = PLAYER.health;
    iCondition.innerHTML = PLAYER.sentiment;
    iMoney.innerHTML = PLAYER.money;
}

//Запуск приветствия
document.addEventListener('DOMContentLoaded', () => {
    let welcomePopup;

    let settings = {
        textTitle: 'Добро пожаловать в Bomjara!',
        formName: 'start_game',
        submitAction: function(e){
            PLAYER = new Player();
            for (let form of e){
                if(e.length === 0) continue;

                for(let field of form) {
                    if(field.id in PLAYER){
                        // console.log(field.value);
                        PLAYER[field.id] = field.value;
                    } else {
                        throw new Error('Wrong property for Player');
                    }
                }
            }

            setValueMenu();
            setValueOnIndicators();
            welcomePopup.close();
        },
        form:{
            step_1: '<p>Привет игрок. Это игра демо образец возможностей программиста Sprada-rus</p>'
        + '<p>Игра простая, но должна быть интересной. Главное что нужно, это выжить.</p>'
        + '<p>В игре представлены вкладки, об каждой из них поподробнее</p>'
        + '<ul>'
        + ' <li><b>Меню</b> - тут собрана вся информация по вашему игроку.</li>'
        + ' <li><b>Здоровье</b> - тут можно выбрать как вы будете лечить своего персонажа. Если здоровье упадет до нуля, то персонаж может умереть.</li>'
        + ' <li><b>Развлечение</b> - тут можно выбрать как персонаж будет развлекаться. Если настроение упадет до нуля, то персонаж может умереть от скуки.</li>'
        + ' <li><b>Работа</b> - устройте персонажа на работу, деньги так или иначе пригодяться для проживания в этом сложном мире.</li>'
        + ' <li><b>Собственность</b> - тут собраны самые лучшие варианты для проживания и для передвижения персонажа.</li>'
        + ' <li><b>Социальный статус</b> - собраны лучшие курсы начиная от изучения таблицы умножения и заканчивая обучением в других странах.</li>'
        + '</ul>'
        + '<p><b>Игра, на данном этапе, не сохраняется.</b> Если вы перезапустите страницу весь ваш прогресс будет утерян.</p>',
            step_2: {
                name: {
                    type: 'text',
                    title: 'Имя',
                    maxSize: 30,
                    defaultValue: 'Иван',
                    description: 'Имя должно состоять из 30 символов'
                },
                age: {
                    type: 'number',
                    title: 'Возраст',
                    maxSize: 40,
                    minSize: 18,
                    defaultValue: 18,
                    description: 'Необходимо указать возраст от 18 до 40.'
                },
                scripts: {
                    checkValues(form){
                        form.addEventListener('keyup', (e) => {
                            if (e.target.id === 'name'){
                                let value = e.target.value;
                                if (value){
                                    e.target.value = value[0].toUpperCase() + value.slice(1);
                                }

                                if (value.match(/[^a-zA-Zа-яА-Я]/)){
                                    e.target.value = value.replace(/[^a-zA-Zа-яА-Я]/g, '');
                                }
                            }
                        })
                    },
                },
            },
        }  
    }

    welcomePopup = new PopupForm(settings);

    setTimeout(() => welcomePopup.open(), 300);
});

//Для работы с недвижимостью объекта
function eventOnBuildObject(){
    const buildNode = document.querySelector('#build_obj.main-value');

    const item = this.item_object;
    if (item.price > PLAYER.money) {
        notification('Нехватает денег!', 1500);
        return;
    }

    if(PLAYER.build_obj.delete(item)){
        PLAYER.changeProprty('money', item.price);
    } else { 
        PLAYER.build_obj.add(item);
        PLAYER.changeProprty('money', -(item.price));
    }

    buildNode.textContent = PLAYER.build_obj.size > 0 ? Array.from(PLAYER.build_obj).map(i => i.name).join(', ') : 'Пусто';
}

//Для работы с транспортом объекта
function eventOnVehicleObject(){
    const vehicleNode = document.querySelector('#vehicle_obj.main-value');

    const item = this.item_object;
    if (item.price > PLAYER.money) {
        notification('Нехватает денег!', 1500);
        return;
    }

    if(PLAYER.vehicle_obj.delete(item.name)){
        PLAYER.changeProprty('money', item.price);
    } else { 
        PLAYER.vehicle_obj.add(item.name);
        PLAYER.changeProprty('money', -(item.price));
    }

    vehicleNode.textContent = PLAYER.vehicle_obj.size > 0 ? Array.from(PLAYER.vehicle_obj).join(', ') : 'Пусто';
}

// Проверка для работы
function jobInterview(education, build){
    if (!PLAYER.build.has(build) || !PLAYER.education.has(education)){
        const tmpArray = [];
        
        if (!PLAYER.education.has(education)) tmpArray.push(education);
        if (!PLAYER.build.has(build)) tmpArray.push(build);

        notification(`Для работы необходимо ${tmpArray.join(' и ')}`, 1500);
        return false;
    } else return true;
}

//Хранение объектов для каждой кнопки в разделах
export const PAGES = {
    //Здоровье
    health_content:{
        //Здоровье: Услуги
        service: {
            name_group: 'Услуги',
            first_service : {
                name: 'Знахарка',
                price: 0,
                action: () => PLAYER.changeProprty('health',9)
            },
            second_service : {
                name: 'Поликлиника',
                price: 10,
                action: function(){ 
                    if (this.price > PLAYER.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    PLAYER.changeProprty('money', -(this.price), false);
                    PLAYER.changeProprty('health',15);
                }
            },
            third_service : {
                name: 'Поликлиника (платные услуги)',
                price: 5000,
                action: function() {
                    if (this.price > PLAYER.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    PLAYER.changeProprty('money', -(this.price), false);
                    PLAYER.changeProprty('health',25);
                },
            },
            fourth_service : {
                name: 'Платная клиника',
                price: 25000,
                action: function() {
                    if (this.price > PLAYER.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    PLAYER.changeProprty('money', -(this.price), false);
                    PLAYER.changeProprty('health',40);
                },
            },
            fifth_service : {
                name: 'Личный врач',
                price: 50000,
                action: function() {
                    if (this.price > PLAYER.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    PLAYER.changeProprty('money', -(this.price), false);
                    PLAYER.changeProprty('health',50);
                },
            },
        },
        // Здоровье: Действие
        actions: {
            name_group: 'Действия',
            first_action : {
                name: 'Найти таблетки на помойке',
                action: () => {
                    PLAYER.changeProprty('health', randomIntRange(3, 12));
                }
            },
            second_action : {
                name: 'Побегать',
                necessary_item: 'Кросовки',
                action: function() {
                    if (!PLAYER.vehicle.has(this.necessary_item)){
                        notification(`Сначала купи ${this.necessary_item.toLowerCase()}`, 1500);
                        return;
                    }
                    PLAYER.changeProprty('health',15);
                }
            },
            third_action : {
                name: 'Покататься на велосипеде',
                necessary_item: 'Велосипед',
                action: function() {
                    if (!PLAYER.vehicle.has(this.necessary_item)){
                        notification(`Сначала купи ${this.necessary_item.toLowerCase()}`, 1500);
                        return;
                    }
                    PLAYER.changeProprty('health',20);
                }
            },
            fourth_action : {
                name: 'Покататься на лыжах',
                price: 50000,
                action: function() {
                    if (this.price > PLAYER.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    PLAYER.changeProprty('money', -(this.price), false);
                    PLAYER.changeProprty('health',45);
                }
            },
            fifth_service : {
                name: 'Отправиться в круиз',
                price: 450000,
                action: function() {
                    if (this.price > PLAYER.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    PLAYER.changeProprty('money', -(this.price), false);
                    PLAYER.changeProprty('health',80);
                }
            }
        }
    },
    //Развлечение
    fun_content : {
        free_fun : {
            name: 'Гоняться за котом',
            action : function(){
                PLAYER.changeProprty('sentiment', randomIntRange(15, 20));
            }
        },
        first_fun : {
            name: 'Выпить боярышника',
            price: 10,
            action: function() {
                if (this.price > PLAYER.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                }
                PLAYER.changeProprty('money', -(this.price), false);
                PLAYER.changeProprty('sentiment', randomIntRange(25, 30) , false);
                PLAYER.changeProprty('health',2)
            }
        },
        second_fun : {
            name: 'Попить пива с друзьями',
            price: 200,
            action: function() {
                if (this.price > PLAYER.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                }
                PLAYER.changeProprty('money', -(this.price), false);
                PLAYER.changeProprty('sentiment', randomIntRange(35, 40), false);
                PLAYER.changeProprty('health',-2)
            }
        },
        third_fun : {
            name: 'Сходить в бар',
            price: 2000,
            action: function() {
                if (this.price > PLAYER.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                }
                PLAYER.changeProprty('money', -(this.price), false);
                PLAYER.changeProprty('sentiment', randomIntRange(45, 50), false);
                PLAYER.changeProprty('health',-5)
            }
        },
        fourth_fun : {
            name : 'Посетить театр',
            price: 10000,
            action: function() {
                if (this.price > PLAYER.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                }
                PLAYER.changeProprty('money', -(this.price), false);
                PLAYER.changeProprty('sentiment', 65, false);
            }
        },
    },
    //Работа
    work_content : {
        bomj_work : {
            name : 'Побираться на помойке',
            action : function(){  
                PLAYER.changeProprty('money', randomIntRange(1, 5))
            }
        },
        shaverma_work : {
            name : 'Шаурмен',
            needEducation: 'Таблица умножения',
            needHousing: 'Палатка',
            action : function() {
                if (jobInterview(this.needEducation, this.needHousing)) {
                    PLAYER.changeProprty('money', randomIntRange(100, 200));
                    PLAYER.status_obj = staticPosition.shaverma_man;
                }
            }
        },
        office_work : {
            name : 'Менеджер',
            needEducation: 'Школа',
            needHousing: 'Съемная комната',
            action : function() {
                if (jobInterview(this.needEducation, this.needHousing)){ 
                    PLAYER.changeProprty('money', randomIntRange(300, 350));
                    PLAYER.status_obj = staticPosition.office_manager;
                }
            }
        },
        manager_work : {
            name: 'Старший менеджер',
            needEducation: 'Колледж',
            needHousing: 'Съемная квартира',
            action : function() {
                if (jobInterview(this.needEducation, this.needHousing)){ 
                    PLAYER.changeProprty('money', randomIntRange(500, 550));
                    PLAYER.status_obj = staticPosition.manager;
                }
            }
        },
        senior_manager_work : {
            name: 'Руководитель отдела',
            needEducation: 'Университет',
            needHousing: 'Квартира',
            action : function() {
                if (jobInterview(this.needEducation, this.needHousing)){ 
                    PLAYER.changeProprty('money', randomIntRange(1000, 1500));
                    PLAYER.status_obj = staticPosition.senior_manager;
                }
            }
        },
        ceo_work : {
            name: 'Генеральный директор',
            needEducation: 'Иностранный университет',
            needHousing: 'Загородный дом',
            action : function() {
                if (jobInterview(this.needEducation, this.needHousing)){ 
                    PLAYER.changeProprty('money', randomIntRange(10000, 15000));
                    PLAYER.status_obj = staticPosition.ceo;
                }
            }
        }
    },
    //Собственность
    item_content : {
        //Жилье
        build: {
            name_group: 'Жилье',
            cardboard_box : {
                item_object : staticBuilds.cardboard_box,
                price: staticBuilds.cardboard_box.price,
                name: 'Купить картонную каробку',
                action : eventOnBuildObject
            },
            tent : {
                item_object : staticBuilds.tent,
                price: staticBuilds.tent.price,
                name: 'Купить палатку',
                action : eventOnBuildObject
            },
            rent_room : {
                item_object : staticBuilds.rent_room,
                price: staticBuilds.rent_room.price,
                name: 'Снимать комнату',
                action : eventOnBuildObject
            },
            rent_flat : {
                item_object : staticBuilds.rent_flat,
                price: staticBuilds.rent_flat.price,
                name : 'Снимать квартиру',
                action : eventOnBuildObject
            },
            buy_flat : {
                item_object : staticBuilds.buy_flat,
                price: staticBuilds.buy_flat.price,
                name : 'Купить квартира',
                action : eventOnBuildObject
            },
            buy_house : {
                item_object : staticBuilds.buy_house,
                price: staticBuilds.buy_house.price,
                name : 'Купить загородный дом',
                action : eventOnBuildObject
            },
        },
        //Транспорт
        vehicle: {
            name_group: 'Транспорт',
            shoes : {
                item_object : staticVehicles.shoes,
                price: staticVehicles.shoes.price,
                name: 'Купить кросовки',
                action : eventOnVehicleObject
            },
            bike : {
                item_object : staticVehicles.bike,
                price: staticVehicles.bike.price,
                name: 'Купить велосипед',
                action : eventOnVehicleObject
            },
            cheap_car : {
                item_object : staticVehicles.cheap_car,
                price: staticVehicles.cheap_car.price,
                name: 'Купить подержанная машина',
                action : eventOnVehicleObject
            },
            car : {
                item_object : staticVehicles.car,
                price: staticVehicles.car.price,
                name: 'Купить машина',
                action : eventOnVehicleObject
            },
            cool_car : {
                item_object : staticVehicles.cool_car,
                price: staticVehicles.cool_car.price,
                name: 'Купить куртая тачка',
                action : eventOnVehicleObject
            }
        }
    },
    //Социальный статус
    social_content : {
        multiplication_table : {
            price : 100,
            name : 'Таблица умножения',
            isDisabled : () => PLAYER.education.has('Таблица умножения'),
            action : function() {
                if (this.price > PLAYER.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                } else if (this.isDisabled()) {
                    return;
                }

                PLAYER.changeProprty('money', -(this.price));
                PLAYER.education.add(this.name);
                document.getElementById('multiplication_table').classList.add('disabled');
            }
        },
        school : {
            price : 50000,
            name : 'Школа',
            isDisabled : () => PLAYER.education.has('Школа'),
            action : function() {
                if (this.price > PLAYER.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                } else if (this.isDisabled()) {
                    return;
                }

                PLAYER.changeProprty('money', -(this.price));
                PLAYER.education.add(this.name);
                document.getElementById('school').classList.add('disabled');
            }
        },
        college : {
            price : 250000,
            name : 'Колледж',
            isDisabled : () =>  PLAYER.education.has('Колледж'),
            action : function() {
                if (this.price > PLAYER.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                } else if (this.isDisabled()) {
                    return;
                }

                PLAYER.changeProprty('money', -(this.price));
                PLAYER.education.add(this.name);
                document.getElementById('college').classList.add('disabled');
            }
        },
        university : {
            price : 500000,
            name : 'Университет',
            isDisabled : () => PLAYER.education.has('Университет'),
            action : function() {
                if (this.price > PLAYER.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                } else if (this.isDisabled()) {
                    return;
                }

                PLAYER.changeProprty('money', -(this.price));
                PLAYER.education.add(this.name);
                document.getElementById('university').classList.add('disabled');
            }
        },
        study_abroad : {
            price : 5000000,
            name : 'Иностранное образование',
            isDisabled : () => PLAYER.education.has('Иностранное образование'),
            action : function() {
                if (this.price > PLAYER.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                } else if (this.isDisabled()) {
                    return;
                }

                PLAYER.changeProprty('money', -(this.price));
                PLAYER.education.add(this.name);
                document.getElementById('study_abroad').classList.add('disabled');
            }
        }
    }
}