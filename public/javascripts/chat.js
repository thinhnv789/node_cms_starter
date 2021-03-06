/*
* Connect socket
*/
const socket = io('http://' + window.location.hostname + ':8080', {
    transports: ['websocket']
});

socket.once('connect', () => {    
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

    /* Event inbox message */
    socket.on('message', (data) => {
        console.log('message', data);
        let partner = data.sender;
        if (data.isOwner) {
            partner = data.recipient;
        }
        let chatBox = document.getElementById('chatbox-' + partner._id);

        if (!chatBox) {
            chatBox = createNewChatBox(partner);

            let chatContainer = document.getElementById('chat-container');

            if (chatContainer) {
                chatContainer.appendChild(chatBox);
            }
        } else {
            chatBox.style = 'display: inline-block';
            let chatboxContainer = document.querySelector('#chatbox-' + partner._id + ' .box-container');

            if (chatboxContainer) {
                let messageItem = null;
                if (data.isOwner) {
                    messageItem = createOwnerMessage(data);
                } else {
                    messageItem= createInboxMessage(data)
                }
                chatboxContainer.appendChild(messageItem);
                chatboxContainer.scrollTop = chatboxContainer.scrollHeight;
            }
        }
    });

    /* Event owner message */
    // socket.on('owner_message', (data) => {
    //     let partner = data.recipient;
    //     let chatBox = document.getElementById('chatbox-' + partner._id);

    //     if (!chatBox) {
    //         chatBox = createNewChatBox(partner);

    //         let chatContainer = document.getElementById('chat-container');

    //         if (chatContainer) {
    //             chatContainer.appendChild(chatBox);
    //         }
    //     } else {
    //         chatBox.style = 'display: inline-block';
    //     }

    //     let chatboxContainer = document.querySelector('#chatbox-' + partner._id + ' .box-container');

    //     if (chatboxContainer) {
    //         let ownerMessageItem = createOwnerMessage(data)
    //         chatboxContainer.appendChild(ownerMessageItem);
    //         chatboxContainer.scrollTop = chatboxContainer.scrollHeight;
    //     }
    // });

    /* Event socket disconnected from server */
    socket.on('disconnect', () => {
        // socket.removeAllListeners();
        console.log('server disconnect');
    });
});