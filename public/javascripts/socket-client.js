/*
* Connect socket
*/
const socket = io('http://192.168.1.68:8008');

socket.on('connect', () => {
    socket.on('hello', (data) => {
        console.log(data);
    });
    
    /* Notification member login */
    socket.on('member_login', (data) => {
        let notiSound = new Audio('/sounds/notification.mp3');
        notiSound.play();
        let count = 0;
        let notificationCount = document.querySelector('#header-notifications .notification-count');
        if (notificationCount) {
            notificationCount.style = 'display: block';
            notificationCount.textContent = parseInt(notificationCount.textContent) + 1;
            count = parseInt(notificationCount.textContent);
        }
        let notiTitle = document.querySelector('#header-notifications .notification-title');
        if (notiTitle) {
            notiTitle.textContent = 'Bạn có ' + count + ' thông báo mới';
        }
        let notiList = document.querySelector('#header-notifications .notification-list');
        if (notiList) {
            let notiItem = '<li><a href="#"><i class="fa fa-user text-aqua"></i> ' + data + '</a></li>';
            notiList.innerHTML += notiItem;
        }
    });
});