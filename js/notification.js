const notification = (text, time) => {
    const header = document.querySelector('.header');
    const notifiElement = document.getElementById('notification');
    if (!notifiElement){
        const element = document.createElement('div');
        element.classList.add('header-info');
        element.id = 'notification';
        element.textContent = text;

        header.insertAdjacentElement('beforeend', element);
        setTimeout(() => {
            element.remove();
        }, time);
    } else {
        notifiElement.remove();
        setTimeout(notification(text,time), 500);
    }
}