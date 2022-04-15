export const notification = (text, time) => {
    const header = document.querySelector('.header');
    const notifiElement = document.getElementById('notification');
    if (!notifiElement){
        const element = document.createElement('div');
        element.id = 'notification';
        element.textContent = text;

        header.insertAdjacentElement('beforeend', element);
        
        setTimeout(() => element.classList.add('header-info'), 100);
        setTimeout(() => {
            element.classList.remove('header-info');
            setTimeout(() => element.remove(), 200);
        }, time);
    } else {
        notifiElement.remove();
        setTimeout(notification(text,time), 500);
    }
}