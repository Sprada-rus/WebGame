/**
 * @author SIA
 * @argument Object `settings`
 * @param settings.textContent is string properties
 * @param settings.textTitle is string properties
 * @param settings.textFooter is string properties
 * @param settings.btnHeaderClose is boolean properties
 * @param settings.btnOnContent is node array properties
 */
export function Popup(settings){
    const btnDestroy = '<div class="popup_destroy"><span class="popup-btn-destroy header-close">X</div>';
    
    const textTitle = document.createElement('div');
    textTitle.classList.add('popup-header');
    if(settings.btnHeaderClose){
        const btnDestroyPopup = document.insertAdjacentHTML(btnDestroy);
        textTitle.btnDestroyPopup;
    }
    if(settings.textTitle){
        const title = document.createElement('p');
        title.classList.add('popup-title');
        title.innerHTML = settings.textTitle;
        textTitle.append(title);
    }

    const content = document.createElement('div');
    content.classList.add('popup-content');
    if(settings.textContent instanceof HTMLElement){
        content.append(settings.textContent);
    } else if(settings.textContent && typeof settings.textContent === 'string'){
        content.insertAdjacentHTML('afterbegin',settings.textContent);
    }
    const buttonBlock = document.createElement('div');
    buttonBlock.classList.add('popup-button-block');
    content.append(buttonBlock)
    
    let textFooter = '<div class="popup-footer">';
    textFooter += settings.textFooter ? settings.textFooter : '';
    textFooter += '</div>';

    const mainPopup = document.createElement('div');
    mainPopup.classList.add('popup-main');
    mainPopup.append(textTitle);
    mainPopup.append(content);
    mainPopup.insertAdjacentHTML('beforeend', textFooter);

    this.popupNode = document.createElement('div');
    this.popupNode.classList.add('popup');
    this.popupNode.classList.add('popup-backside');
    this.popupNode.append(mainPopup);

    document.body.appendChild(this.popupNode);

    document.querySelectorAll('.popup-btn-destroy').forEach(
        el => el.addEventListener('click', () => {
            this.popupNode.classList.remove('popup-open');
            setTimeout(() => document.body.removeChild(popupNode), 800);
        })
    );

    if (Array.isArray(settings.btnOnContent) && settings.btnOnContent.length !== 0){
        for (let element of settings.btnOnContent){
            if(element?.ELEMENT_NODE === 1){
                buttonBlock.appendChild(element);
            }
        }
    }
}

Popup.prototype = {
    open: function(){
        this.popupNode.classList.add('popup-open');
    },
    close: function(){
        this.popupNode.classList.remove('popup-open');
    },
    destroy: function(){
        this.popupNode.classList.remove('popup-open');
        setTimeout(() => document.body.removeChild(this.popupNode), 200);
    },

    get popup() {return this.popupNode}
}


/**
 * @class PopupForm
 * Класс принимает в себя форму для заполнения полей.
 * Класс наследует основной класс Popup
 * @argument Object settings 
 * @param Object settings.form
 * @param String settings.formName
 * @param String settings.textTitle
 * @param String settings.textFooter
 * @param Boolean settings.btnHeaderClose
 * @param function settings.submitAction 
 */

export function PopupForm(settings){
    this.form = document.createElement('form');
    this.formId = settings.formName;
    this.form.id = this.formId;
    this.formValues = [];

    if(settings.form === undefined){
        throw new Error('Form is empty');
    }

    Object.entries(settings.form).forEach(([step, value], index) => {
        let stepForm = document.createElement('div');
        stepForm.id = `step_${step}`;
        if (index !== 0){
            stepForm.classList.add('disabled');
        }

        if (Object.getPrototypeOf(value) === Object.prototype){
            for(let [field, attr] of Object.entries(value)){
                let stepField = document.createElement('input');
                stepField.id = `${step}_${field}`;
                stepField.type = attr.type;

                if(attr.title){
                    let titleField = document.createElement('lable');
                    titleField.htmlFor = stepField.id;
                    titleField.innerHTML = attr.title;
                    stepForm.appendChild(titleField);
                }

                stepForm.appendChild(stepField);
            }
        }

        if (typeof value === 'string'){
            stepForm.insertAdjacentHTML('afterBegin', value);
        }

        this.form.append(stepForm);
    });

    //Костыль, пока не понял как сделать
    this.stepByStep = (e) => {
        const target = e.target.id;
        console.log(this);
        const arrayForm = Object.values(this.form.children);
        const activeForm = arrayForm.find((el) => !el.classList.contains('disabled'));
        let step = arrayForm.indexOf(activeForm);
        let activatedForm = null;
        switch(target){
            case 'form_btn_back':
                activatedForm = arrayForm[step - 1];
                activeForm.classList.add('disabled');
                activatedForm.classList.remove('disabled');
                
                if(arrayForm.indexOf(activatedForm) === 0){
                    e.target.classList.add('disabled');
                }
    
                if(arrayForm.indexOf(activatedForm) < arrayForm.length - 1){
                    e.target.parentElement.children[1].innerText = 'Вперед';
                }
                break;
            case 'form_btn_next':
                if(step === arrayForm.length - 1){
                    this.form.submit();
                    break;
                }

                e.target.parentElement.children[0].classList.remove('disabled');
                activatedForm = arrayForm[step + 1];
                activeForm.classList.add('disabled');
                activatedForm.classList.remove('disabled');
                if (arrayForm.indexOf(activatedForm) === arrayForm.length - 1){
                    e.target.innerText = 'Начнем играть';
                }
                break;
        }
    }
    //Конец костыля

    this.form.submit = settings.submitAction;
    const btnBack = document.createElement('button');
    btnBack.id = 'form_btn_back';
    btnBack.classList.add('btn');
    btnBack.classList.add('disabled');
    btnBack.innerText = 'Назад';
    btnBack.addEventListener('click', this.stepByStep)
    const btnNext = document.createElement('button');
    btnNext.id = 'form_btn_next';
    btnNext.classList.add('btn');
    btnNext.innerText = 'Вперед';
    btnNext.addEventListener('click', this.stepByStep)
    let stepButtons = [btnBack, btnNext];

    let customSettings = {
        textContent: this.form,
        textFooter: settings.textFooter,
        textTitle: settings.textTitle,
        btnHeaderClose: settings.btnHeaderClose,
        btnOnContent: stepButtons,
    }

    this.popupNode = new Popup(customSettings).popup;
}

PopupForm.prototype = Object.create(Popup.prototype);
PopupForm.prototype.constructor = PopupForm;