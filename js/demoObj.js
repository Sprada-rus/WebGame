//Пользовательский объект 
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
    days: 0,
    dangerDays: 0,
    changeHealth: function(num, needNextDay = true) {
        const healthNode = document.querySelector('#health_indication');
        this.health = (this.health + num >= 100 
            ? 100 
            : (this.health + num <= 0 ? 0 : this.health + num));
        healthNode.textContent = this.health + '';
        
        if (needNextDay) {
            this.nextDay();
        }
    },
    changeMoney: function(num, needNextDay = true) {
        const moneyNode = document.querySelector('#money_indication');
        this.money += num; 
        moneyNode.textContent = this.money + '';
        
        if (needNextDay) {
            this.nextDay();
        }
    },
    changeCondition: function(num, needNextDay = true) {
        const conditionNode = document.querySelector('#condition_indication');
        this.condition = (this.condition + num >= 100 
            ? 100 
            : (this.condition + num <= 0 ? 0 : this.condition + num));
        conditionNode.textContent = this.condition + '';
        
        if (needNextDay) {
            this.nextDay();
        }
    },
    nextDay: function(){
        this.days++;
        if (this.days === 365){
            this.days = 0;
            this.age_obj++;
        }
        console.log(`Test obj: age = ${this.age_obj}, days = ${this.days}`);

        this.changeHealth(-(10 * 1), false);
        this.changeMoney(-10 * 1, false);
        this.changeCondition(-10 * 1, false);

        this.checkConditon();
    },
    checkConditon: function(){
        if (this.dangerDays >= 3){
            console.log('GAME OVER!');
            return;
        }

        const dangerCondition = [];
        this.health === 0 ? dangerCondition.push('здоровье') : null;
        this.money <= 0 ? dangerCondition.push('деньги') : null;
        this.condition === 0 ? dangerCondition.push('настроение') : null;

        if (dangerCondition.length !== 0){
            let text = dangerCondition[0].charAt(0).toUpperCase() + dangerCondition.join(', ').slice(1);
            
            console.log(`${text} критично малы, решите проблемы за 3 дня или вы проиграете!`);
            this.dangerDays++;
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

        let nodeValue = demoObj[elementId] === null ? 'Пусто' : demoObj[elementId];
        document.querySelector(`#${elementId}`).textContent = nodeValue;
    }
}
//Проставление значения для индикаторов "Здоровье, деньги, настроение"
const setValueOnIndicators = () => {
    const iHealth = document.querySelector('#health_indication');
    const iCondition = document.querySelector('#condition_indication');
    const iMoney = document.querySelector('#money_indication');

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

    setTimeout(() => welcomePopup.open(), 100);

    testPopupNode = welcomePopup.popup;
});





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