import { randomIntRange } from "./randomHelp.js";
import { notification } from "./notification.js";
import { Popup } from "./popup.js";

/**
* Данный класс создает игровой объект с которым в лаьнейшем будут происходить манипуляции
* Для корректной работы необходимо передавать следующие значени:
* @param Object gameObject - передается объект в котором есть свойства:
* @argument String gameObject.name Имя персонажа
* @argument Number gameObject.age Возраст персонажа
*/
export function Player(){
  this.name = 'Тест';
  this.age = 18;
  this.status = staticPosition.bomjara.name;
  this.education = new Set();
  this.vehicle = new Set()
  this.build = new Set();
  this.health = 50;
  this.sentiment = 50;
  this.money = 0;
  this.days = 0;
  this.rentBuild = new Map();
}

Player.prototype = {
  //Метод изменения состояния персонажа
  changeProprty: function(property, num, nextDay = true){
    const objProperty = ['money', 'health', 'sentiment'];
    if (!objProperty.includes(property)){
      throw Error(`${property} isn't in Game Object`);
    }

    if(objProperty.slice(1).includes(property)){
      this[property] = this[property] + num >= 100 
      ? 100
      : (this[property] + num <= 0 ? 0 : this[property] + num);
    } else {
      this[property] += num;
    }

    if(nextDay) this.nextDay();
    document.getElementById(`${property}_indication`).textContent = this[property].toLocaleString();
  },

  //Метод для перехода на следующий день
  nextDay: function(){
    if(++this.days === 365){
      this.days = 0;
      this.age++;
    }
    
    let updHealth = 0, updSentiment = 0, hasRent = false;
    if(this.build.size !== 0){
      Array.from(this.build).sort((a, b) => b.price - a.price).forEach((build, index) => {
        //Получаем значения для улучшения жизни персонажа
        if(index === 0){
          [updHealth, updSentiment] = [build.amelioration_health ?? 0, build.amelioration_fun ?? 0];
        }
        
        //Блок обработки арендной недвижимости 
        if(build.isRent){
          this.rentBuild.has(build.name)
          ? this.rentBuild.set(build.name, this.rentBuild.get(build.name))
          : this.rentBuild.set(build.name, 0);
          
          //Время расплаты
          if (this.rentBuild.get(build.name) === 28){
            if(this.money >= (build.price)){
              this.changeProprty('money', -(build.price), false);
              notification(`Плата за ${build.name} ${element.price}`, 2500);
            } else {
              this.rentBuild.delete(build.name);
              notification(`Вас выгнали из ${build.name}`, 2500);
            }
          }

          hasRent = true;
        }
      });

      if(!hasRent && this.rentBuild.size !== 0)  this.rentBuild.clear();
    }

    this.checkCondition();
    this.changeProprty('health', -randomIntRange(4 - updHealth, 7 - updHealth), false);
    this.changeProprty('sentiment', -randomIntRange(4 - updHealth, 7 - updHealth), false);
  },

  //Проверка! Жив ли подопотный?
  checkCondition: function(){
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

      const gameOverPop = new Popup(settings);
      gameOverPop.open();

      console.log('GAME OVER!');
      return;
    }
    
    let isOK = true;
    for(let prop of ['health', 'sentiment']){
      if(this[prop] === 0) isOK = false;
    }

    if(!isOK){
      let leftDays = `${3 - this.dangerDays} ${3 - this.dangerDays === 1 ? 'день' : 'дня'}`;
      notification(`Внимание! Ваши показатели на нуле, исправьте это или через ${leftDays} вы проиграете`, 2000);
      this.dangerDays += 1;
    } else {
      this.dangerDays = 0;
    }
  },

}