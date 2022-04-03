//Пользовательский объект 
const demoObj = {
    name_obj: 'Василий',
    age_obj: 24,
    status_obj: 'Бомж',
    education: new Set(),
    vehicle_obj: new Set(),
    build_obj: new Set(),
    rating_obj: 0,
    health: 50,
    money: 0,
    condition: 50,
    days: 0,
    dangerDays: 0,
    rentBuild: new Map(),
    changeProprty: function(property, num, needNextDay = true){
        
        const mainProperty = ['money', 'health', 'condition'];

        if(mainProperty.indexOf(property) === -1) return;
        
        const propertyNode = document.getElementById(`${property}_indication`);
        
        if(mainProperty.slice(1).indexOf(property) !== -1){
            this[property] = (this[property] + num >= 100 
                ? 100 
                : (this[property] + num <= 0 ? 0 : this[property] + num));
        } else {
            this[property] += num;
        }

        if(needNextDay) this.nextDay();

        propertyNode.textContent = this[property].toLocaleString();
    },
    nextDay: function(){
        this.days++;
        if (this.days === 365){
            this.days = 0;
            this.age_obj++;
        }

        let build = this.build_obj.size > 0 
            ? Array.from(this.build_obj)
            : null ;

        let lastBuild = build && build.sort((a, b) => b.price - a.price)[0];

        let upgradeHealth = lastBuild?.amelioration_health ?? 0;
        let upgradeCondition = lastBuild?.amelioration_fun ?? 0;
        
        let minDamage = 5;
        let maxDamage = 8;
        
        let hasRent;
        //Есть ли жилье в аренду и надо ли платить
        this.build_obj.forEach(element => {
            if(element.isRent){
                this.rentBuild.has(element.name) ? this.rentBuild.set(element.name, this.rentBuild.get(element.name) + 1)
                : this.rentBuild.set(element.name, 0);

                if(this.rentBuild.get(element.name) === 28) {

                    if (demoObj.money > (element.price)){
                        demoObj.changeProprty('money', -(element.price), false);
                        notification(`Плата за ${element.name} ${element.price}`, 2500);
                    } else {
                        demoObj.rentBuild.delete(element)
                        notification(`Вас выгнали из ${element.name}`, 2000);
                    }
                }
                hasRent = true
            }
        });
        
        if(!!!hasRent) this.rentBuild.clear();

        
        this.checkConditon();
        this.changeProprty('health', -randomIntRange(minDamage - upgradeHealth, maxDamage - upgradeHealth), false);
        this.changeProprty('condition', -randomIntRange(minDamage - upgradeCondition, maxDamage - upgradeCondition), false);
    },
    checkConditon: function(){
        if (this.dangerDays >= 3){
            const title = 'GAME OVER!';
            const content = '<p>Вы проиграли, но вы можете начать заново.<br>Попробуем ещё раз?</p>'
            const returnBtn = document.createElement('div');
            returnBtn.classList.add('btn');
            returnBtn.textContent = 'Ещё раз';
            returnBtn.addEventListener('click', () => window.location.reload());

            const settings = {
                textContent : content,
                textTitle : title,
                btnOnContent : [returnBtn]
            };            

            const gameOverPop = Popup(settings);
            gameOverPop.open();

            console.log('GAME OVER!');
            return;
        }

        const dangerCondition = [];
        this.health === 0 ? dangerCondition.push('здоровьем') : null;
        this.condition === 0 ? dangerCondition.push('настроением') : null;

        if (dangerCondition.length !== 0 && (this.health === 0 || this.condition === 0)){
            let text = dangerCondition.join(' и ');
            let leftDays = 3 - this.dangerDays > 0 
                ? `${3 - this.dangerDays} ${3 - this.dangerDays === 1 ? 'день' : 'дня'}`
                : 'в этот день';
            notification(`Сделайте что-то с ${text}, иначе через ${leftDays} вы проиграете!`, 1500);
            this.dangerDays += 1;
        } else {
            this.dangerDays = 0;
        }
    }
}

//Первая загрузка страницы, проставление значений в разделе "Меню"
const setValueMenu = () => {
    let mainContent = document.querySelector('.main-content');

    for(let el of mainContent.children){
        let elementId = el.children[1].id;
        let nodeValue = '';
        if(demoObj[elementId].toString() === '[object Set]'){
            nodeValue = demoObj[elementId].size > 0 ? Array.from(demoObj[elementId]).join(', ') : 'Пусто';
        } else{
            nodeValue = demoObj[elementId] === null ? 'Пусто' : demoObj[elementId];
        }

        document.querySelector(`#${elementId}`).textContent = nodeValue;
    }
}

//Проставление значения для индикаторов "Здоровье, деньги, настроение"
const setValueOnIndicators = () => {
    const iHealth = document.getElementById('health_indication');
    const iCondition = document.getElementById('condition_indication');
    const iMoney = document.getElementById('money_indication');

    iHealth.innerHTML = demoObj.health;
    iCondition.innerHTML = demoObj.condition;
    iMoney.innerHTML = demoObj.money;
}

//Тест
let testPopupNode = '';

//Запуск приветствия
document.addEventListener('DOMContentLoaded', () => {
    const title = 'Добро пожаловать в Bomjara!';
    const content = '<p>Привет игрок. Это игра демо образец возможностей программиста Sprada-rus</p>'
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
    + '<p><b>Игра, на данном этапе, не сохраняется.</b> Если вы перезапустите страницу весь ваш прогресс будет утерян.</p>';

    const btnOK = document.createElement('div');
    btnOK.classList.add('btn');
    btnOK.innerText = 'OK';

    // btnOK

    //Настройка уведомления
    const settingsWelcome = {
        textContent: content,
        textTitle: title,
        btnOnContent: [btnOK]
    };

    const welcomePopup = Popup(settingsWelcome);

    btnOK.addEventListener('click', () => {
        setValueMenu();
        setValueOnIndicators();
        welcomePopup.destroy();
    });

    setTimeout(() => welcomePopup.open(), 300);

    testPopupNode = welcomePopup.popup;
});

//Для работы с недвижимостью объекта
function eventOnBuildObject(){
    const buildNode = document.querySelector('#build_obj.main-value');

    const item = this.item_object;
    if (item.price > demoObj.money) {
        notification('Нехватает денег!', 1500);
        return;
    }

    if(demoObj.build_obj.delete(item)){
        demoObj.changeProprty('money', item.price);
    } else { 
        demoObj.build_obj.add(item);
        demoObj.changeProprty('money', -(item.price));
    }

    buildNode.textContent = demoObj.build_obj.size > 0 ? Array.from(demoObj.build_obj).map(i => i.name).join(', ') : 'Пусто';
}

//Для работы с транспортом объекта
function eventOnVehicleObject(){
    const vehicleNode = document.querySelector('#vehicle_obj.main-value');

    const item = this.item_object;
    if (item.price > demoObj.money) {
        notification('Нехватает денег!', 1500);
        return;
    }

    if(demoObj.vehicle_obj.delete(item.name)){
        demoObj.changeProprty('money', item.price);
    } else { 
        demoObj.vehicle_obj.add(item.name);
        demoObj.changeProprty('money', -(item.price));
    }

    vehicleNode.textContent = demoObj.vehicle_obj.size > 0 ? Array.from(demoObj.vehicle_obj).join(', ') : 'Пусто';
}

// Проверка для работы
function jobInterview(education, build){
    if (!demoObj.education.has(education) || !demoObj.build_obj.has(build)){
        const tmpArray = [];

        if(!demoObj.education.has(education))  tmpArray.push(education);
        if(! Array.from(demoObj.build_obj).find(b => b.name === build)) tmpArray.push(build);

        notification(`Для работы необходимо ${tmpArray.join(' и ')}`, 1500);
        return false;
    } else return true;
}

//Хранение объектов для каждой кнопки в разделах
const PAGES = {
    //Здоровье
    health_content:{
        //Здоровье: Услуги
        service: {
            name_group: 'Услуги',
            first_service : {
                name: 'Знахарка',
                price: 0,
                action: () => demoObj.changeProprty('health',9)
            },
            second_service : {
                name: 'Поликлиника',
                price: 10,
                action: function(){ 
                    if (this.price > demoObj.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    demoObj.changeProprty('money', -(this.price), false);
                    demoObj.changeProprty('health',15);
                }
            },
            third_service : {
                name: 'Поликлиника (платные услуги)',
                price: 5000,
                action: function() {
                    if (this.price > demoObj.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    demoObj.changeProprty('money', -(this.price), false);
                    demoObj.changeProprty('health',25);
                },
            },
            fourth_service : {
                name: 'Платная клиника',
                price: 25000,
                action: function() {
                    if (this.price > demoObj.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    demoObj.changeProprty('money', -(this.price), false);
                    demoObj.changeProprty('health',40);
                },
            },
            fifth_service : {
                name: 'Личный врач',
                price: 50000,
                action: function() {
                    if (this.price > demoObj.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    demoObj.changeProprty('money', -(this.price), false);
                    demoObj.changeProprty('health',50);
                },
            },
        },
        // Здоровье: Действие
        actions: {
            name_group: 'Действия',
            first_action : {
                name: 'Найти таблетки на помойке',
                action: () => {
                    demoObj.changeProprty('health', randomIntRange(3, 12));
                }
            },
            second_action : {
                name: 'Побегать',
                necessary_item: 'Кросовки',
                action: () => {
                    demoObj.changeProprty('health',15);
                }
            },
            third_action : {
                name: 'Покататься на велосипеде',
                necessary_item: 'Велосипед',
                action: () => {
                    demoObj.changeProprty('health',20);
                }
            },
            fourth_action : {
                name: 'Покататься на лыжах',
                price: 50000,
                action: function() {
                    if (this.price > demoObj.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    demoObj.changeProprty('money', -(this.price), false);
                    demoObj.changeProprty('health',45);
                }
            },
            fifth_service : {
                name: 'Отправиться в круиз',
                price: 450000,
                action: function() {
                    if (this.price > demoObj.money) {
                        notification('Нехватает денег!', 1500);
                        return;
                    }
                    demoObj.changeProprty('money', -(this.price), false);
                    demoObj.changeProprty('health',80);
                }
            }
        }
    },
    //Развлечение
    fun_content : {
        free_fun : {
            name: 'Гоняться за котом',
            action : function(){
                demoObj.changeProprty('condition', randomIntRange(15, 20));
            }
        },
        first_fun : {
            name: 'Выпить боярышника',
            price: 10,
            action: function() {
                if (this.price > demoObj.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                }
                demoObj.changeProprty('money', -(this.price), false);
                demoObj.changeProprty('condition', randomIntRange(25, 30) , false);
                demoObj.changeProprty('health',2)
            }
        },
        second_fun : {
            name: 'Попить пива с друзьями',
            price: 200,
            action: function() {
                if (this.price > demoObj.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                }
                demoObj.changeProprty('money', -(this.price), false);
                demoObj.changeProprty('condition', randomIntRange(35, 40), false);
                demoObj.changeProprty('health',-2)
            }
        },
        third_fun : {
            name: 'Сходить в бар',
            price: 2000,
            action: function() {
                if (this.price > demoObj.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                }
                demoObj.changeProprty('money', -(this.price), false);
                demoObj.changeProprty('condition', randomIntRange(45, 50), false);
                demoObj.changeProprty('health',-5)
            }
        },
        fourth_fun : {
            name : 'Посетить театр',
            price: 10000,
            action: function() {
                if (this.price > demoObj.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                }
                demoObj.changeProprty('money', -(this.price), false);
                demoObj.changeProprty('condition', 65, false);
            }
        },
    },
    //Работа
    work_content : {
        bomj_work : {
            name : 'Побираться на помойке',
            action : () => demoObj.changeProprty('money', randomIntRange(1, 5))
        },
        shaverma_work : {
            name : 'Шаурмен',
            needEducation: 'Таблица умножения',
            needHousing: 'Палатка',
            action : function() {
                if (jobInterview(this.needEducation, this.needHousing)) demoObj.changeProprty('money', randomIntRange(100, 200));
            }
        },
        office_work : {
            name : 'Менеджер',
            needEducation: 'Школа',
            needHousing: 'Съемная комната',
            action : function() {
                if (jobInterview(this.needEducation, this.needHousing)) demoObj.changeProprty('money', randomIntRange(300, 350));
            }
        },
        manager_work : {
            name: 'Старший менеджер',
            needEducation: 'Колледж',
            needHousing: 'Съемная квартира',
            action : function() {
                if (jobInterview(this.needEducation, this.needHousing)) demoObj.changeProprty('money', randomIntRange(500, 550));
            }
        },
        senior_manager_work : {
            name: 'Руководитель отдела',
            needEducation: 'Университет',
            needHousing: 'Квартира',
            action : function() {
                if (jobInterview(this.needEducation, this.needHousing)) demoObj.changeProprty('money', randomIntRange(1000, 1500));
            }
        },
        ceo_work : {
            name: 'Генеральный директор',
            needEducation: 'Иностранный университет',
            needHousing: 'Загородный дом',
            action : function() {
                if (jobInterview(this.needEducation, this.needHousing)) demoObj.changeProprty('money', randomIntRange(10000, 15000));
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
            isDisabled : () => demoObj.education.has('Таблица умножения'),
            action : function() {
                if (this.price > demoObj.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                } else if (this.isDisabled()) {
                    return;
                }

                demoObj.changeProprty('money', -(this.price));
                demoObj.education.add(this.name);
                document.getElementById('multiplication_table').classList.add('disabled');
            }
        },
        school : {
            price : 50000,
            name : 'Школа',
            isDisabled : () => demoObj.education.has('Школа'),
            action : function() {
                if (this.price > demoObj.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                } else if (this.isDisabled()) {
                    return;
                }

                demoObj.changeProprty('money', -(this.price));
                demoObj.education.add(this.name);
                document.getElementById('school').classList.add('disabled');
            }
        },
        college : {
            price : 250000,
            name : 'Колледж',
            isDisabled : () =>  demoObj.education.has('Колледж'),
            action : function() {
                if (this.price > demoObj.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                } else if (this.isDisabled()) {
                    return;
                }

                demoObj.changeProprty('money', -(this.price));
                demoObj.education.add(this.name);
                document.getElementById('college').classList.add('disabled');
            }
        },
        university : {
            price : 500000,
            name : 'Университет',
            isDisabled : () => demoObj.education.has('Университет'),
            action : function() {
                if (this.price > demoObj.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                } else if (this.isDisabled()) {
                    return;
                }

                demoObj.changeProprty('money', -(this.price));
                demoObj.education.add(this.name);
                document.getElementById('university').classList.add('disabled');
            }
        },
        study_abroad : {
            price : 5000000,
            name : 'Иностранное образование',
            isDisabled : () => demoObj.education.has('Иностранное образование'),
            action : function() {
                if (this.price > demoObj.money) {
                    notification('Нехватает денег!', 1500);
                    return;
                } else if (this.isDisabled()) {
                    return;
                }

                demoObj.changeProprty('money', -(this.price));
                demoObj.education.add(this.name);
                document.getElementById('study_abroad').classList.add('disabled');
            }
        }
    }
}