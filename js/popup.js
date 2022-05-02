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
    this.form = document.createElement('div');
    this.form.id = settings.formName;
    this.formValues = [];

    if(settings.form === undefined){
        throw new Error('Form is empty');
    }

    Object.entries(settings.form).forEach(([step, value]) => {
        let stepForm = document.createElement('form');
        
        stepForm.id = `step_${step}`;

        if (Object.getPrototypeOf(value) === Object.prototype){
            for(let [field, attr] of Object.entries(value)){
                if(field === 'scripts'){
                    continue;
                }
                let stepField = document.createElement('div');
                stepField.id = `input_${field}`;
                let input = document.createElement('input');
                input.id = `${field}`;
                input.type = attr.type;
                let divContainer = document.createElement('div');
                divContainer.classList.add('input-container');
                divContainer.appendChild(input);

                if(attr.title){
                    let titleField = document.createElement('lable');
                    titleField.htmlFor = input.id;
                    titleField.innerHTML = attr.title;
                    stepField.appendChild(titleField);
                }

                if(attr.description){
                    let inputDescriprion = document.createElement('div');
                    inputDescriprion.classList.add('input-description');
                    inputDescriprion.innerHTML = attr.description;
                    divContainer.appendChild(inputDescriprion);
                }

                if(attr.maxSize && attr.type === 'number'){
                    input.onchange = (e) => {
                        let value = e.target.value;

                        if(value > attr.maxSize){
                            e.target.value = attr.maxSize;
                            dangerField(e.target);
                        }

                        if(attr.minSize && value < attr.minSize){
                            e.target.value = attr.minSize;
                            dangerField(e.target);
                        }
                    };
                }

                if(attr.maxSize && attr.type === 'text'){
                    input.onchange = (e) => {
                        let value = e.target.value.length;

                        if(value > attr.maxSize){
                            e.target.value = e.target.value.slice(0, attr.maxSize-1);
                            dangerField(e.target);
                        }
                    };
                }

                if(attr.defaultValue){
                    input.value = attr.defaultValue;
                }

                stepField.appendChild(divContainer);
                stepForm.appendChild(stepField);

            }

            if(value.scripts){
                for(let fun in value.scripts){
                    value.scripts[fun](stepForm);
                }
            }
        }

        if (typeof value === 'string'){
            stepForm.insertAdjacentHTML('afterBegin', value);
        }

        this.formValues.push(stepForm);
    });

    //Костыль, пока не понял как сделать
    this.stepByStep = (e) => {
        const target = e.target.id;
        // console.log(this);
        const activeForm = document.querySelector(`#${this.form.id} form`);
        let step = this.formValues.indexOf(activeForm);
        let activatedForm = null;
        switch(target){
            case 'form_btn_back':
                activatedForm = this.formValues[step - 1];
                // activeForm.classList.add('disabled');
                document.getElementById(`${this.form.id}`).removeChild(activeForm)
                // activatedForm.classList.remove('disabled');
                document.getElementById(`${this.form.id}`).append(activatedForm);
                if(this.formValues.indexOf(activatedForm) === 0){
                    e.target.classList.add('disabled');
                }
    
                if(this.formValues.indexOf(activatedForm) < this.formValues.length - 1){
                    e.target.parentElement.children[1].innerText = 'Вперед';
                }
                break;
            case 'form_btn_next':
                if(step === this.formValues.length - 1){
                    this.form.submit(this.formValues);
                    break;
                }

                e.target.parentElement.children[0].classList.remove('disabled');
                activatedForm = this.formValues[step + 1];
                document.getElementById(`${this.form.id}`).removeChild(activeForm);
                document.getElementById(`${this.form.id}`).append(activatedForm);
                if (this.formValues.indexOf(activatedForm) === this.formValues.length - 1){
                    e.target.innerText = 'Начнем играть';
                }
                break;
        }
    }
    //Конец костыля

    this.form.submit = settings.submitAction;
    this.form.append(this.formValues[0]);
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

function dangerField(target){
    console.log(target.parentElement);
    let description = target.parentElement.querySelector('.input-description')
    
    target.classList.add('danger-field');
    description.classList.add('danger-field');
    setTimeout(() => {
        description.classList.remove('danger-field');
        target.classList.remove('danger-field');
    }, 2000);
}