function createInboxMessage(data) {
    let inboxMessage = document.createElement('div');
    inboxMessage.className = 'inbox-message';

    let avatar = document.createElement('div');
    avatar.className = 'mess-item-avatar';
    inboxMessage.appendChild(avatar);

    let avatarImg = document.createElement('img');
    avatarImg.src = 'http://192.168.1.68:8018/images/avatar/thumb/avatar-1524639778103.png';
    avatar.appendChild(avatarImg);

    let messContent = document.createElement('div');
    messContent.className = 'message-content';
    inboxMessage.appendChild(messContent);

    let messContentText = document.createElement('div');
    messContentText.className = 'message-content-text';
    messContentText.textContent = data.messageContent;
    messContent.appendChild(messContentText);

    return inboxMessage;
}

function createOwnerMessage(data) {
    let ownerMessage = document.createElement('div');
    ownerMessage.className = 'owner-message';

    let messContent = document.createElement('div');
    messContent.className = 'message-content';
    ownerMessage.appendChild(messContent);

    let messContentText = document.createElement('div');
    messContentText.className = 'message-content-text';
    messContentText.textContent = data;
    messContent.appendChild(messContentText);

    return ownerMessage;
}

function createNewChatBox(data) {
    let chatBox = document.createElement('div');
    chatBox.className = 'chatbox';
    chatBox.id = 'chatbox-' + data._id;

    let boxHeader = document.createElement('div');
    boxHeader.className = 'box-header';
    boxHeader.onclick = function() {
        chatBox.classList.toggle('chatbox-hidden');
    }
    chatBox.appendChild(boxHeader);

    let partnerName = document.createElement('div');
    partnerName.className = 'partner-name';
    partnerName.textContent = data.fullName;
    boxHeader.appendChild(partnerName);

    let toolBar = document.createElement('div');
    toolBar.className = 'toolbar';
    boxHeader.appendChild(toolBar);

    let hideBox = document.createElement('span');
    hideBox.className = 'hide-box';
    hideBox.onclick = function() {
        if (!chatBox.classList.contains('chatbox-hidden')) {
            // chatBox.classList.add('chatbox-hidden');
        }
    }
    toolBar.appendChild(hideBox);

    let closeBox = document.createElement('span');
    closeBox.className = 'close-box';
    closeBox.onclick = function() {
        chatBox.style = 'display: none';
    }
    toolBar.appendChild(closeBox);

    let avatar = document.createElement('div');
    avatar.className = 'chat-box-avatar';
    chatBox.appendChild(avatar);

    let avatarImg = document.createElement('img');
    avatarImg.src = data.avatarUrl;
    avatar.appendChild(avatarImg);

    let partnerInfo = document.createElement('div');
    partnerInfo.className = 'partner-info';
    partnerInfo.textContent = (data.phoneNumber || data.email || data.userName);
    chatBox.appendChild(partnerInfo);

    let boxContainer = document.createElement('div');
    boxContainer.className = 'box-container';
    chatBox.appendChild(boxContainer);

    /** */
    // let inboxMessItem = createInboxMessage({});
    // boxContainer.appendChild(inboxMessItem);
    // let ownerMessItem = createOwnerMessage({});
    // boxContainer.appendChild(ownerMessItem);
    /** */

    let boxFooter = document.createElement('div');
    boxFooter.className = 'chatbox-footer';
    chatBox.appendChild(boxFooter);

    let inputMessage = document.createElement('input')
    inputMessage.className = 'chatbox-input-message';
    inputMessage.placeholder = 'Enter message ...';
    inputMessage.onkeydown = function(e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13 && !e.shiftKey) {  // Enter keycode
            let messVal = inputMessage.value;

            if (messVal) {
                // let ownerMessItem = createOwnerMessage(messVal);
                // boxContainer.appendChild(ownerMessItem);
                /**
                 * Emit message to socket server
                 */
                let dataSend = {
                    recipient: data,
                    messageContent: messVal
                }
                console.log('dataSend', dataSend);
                socket.emit('send_message', dataSend);

                inputMessage.value = '';
                boxContainer.scrollTop = boxContainer.scrollHeight;
            }
            return false;
        }
    }
    boxFooter.appendChild(inputMessage);

    let btnSendMessage = document.createElement('button');
    btnSendMessage.className = 'chatbox-btn-send';
    btnSendMessage.onclick = function() {
        let value = inputMessage.value;
        if (value) {
            // let ownerMessItem = createOwnerMessage(value);
            // boxContainer.appendChild(ownerMessItem);

            /**
             * Emit message to socket server
             */
            let dataSend = {
                recipient: data,
                messageContent: value
            }
            console.log('dataSend', dataSend);
            socket.emit('send_message', dataSend);

            inputMessage.value = '';
            boxContainer.scrollTop = boxContainer.scrollHeight;
        }
    }
    boxFooter.appendChild(btnSendMessage);

    return chatBox;
}

function createContactItem(data) {
    let chatItem = document.createElement('div');
    chatItem.className = 'contact-item';

    let avatar = document.createElement('div');
    avatar.className = 'avatar';
    if (!data.avatar) {
        avatar.style = 'opacity: 0;';
    }
    chatItem.appendChild(avatar);

    let avatarImg = document.createElement('img');
    avatarImg.className = 'avatar-image';
    avatarImg.src = data.avatarUrl;
    avatar.appendChild(avatarImg);

    let contactInfo = document.createElement('div');
    contactInfo.className = 'contact-info';
    chatItem.appendChild(contactInfo);

    let contactName = document.createElement('div');
    contactName.className = 'contact-name';
    contactName.textContent = data.fullName;
    contactInfo.appendChild(contactName);

    let onLineStatus = document.createElement('div');
    onLineStatus.className = 'online-status';
    chatItem.appendChild(onLineStatus);

    let onlineItem = document.createElement('span');
    onlineItem.className = 'online';
    onLineStatus.appendChild(onlineItem);

    chatItem.onclick = function() {
        let chatBox = document.getElementById('chatbox-' + data._id);

        if (!chatBox) {
            chatBox = createNewChatBox(data);

            let chatContainer = document.getElementById('chat-container');

            if (chatContainer) {
                chatContainer.appendChild(chatBox);
            }
        } else {
            chatBox.style = 'display: inline-block';
        }
    }

    return chatItem;
}

function getChatContacts() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let dataRes = JSON.parse(xhr.responseText);
            let listContact = document.querySelector('#list-contacts .list-items');

            if (dataRes && dataRes.success && listContact) {
                let data = dataRes.data;

                for (let i=0; i<data.length; i++) {
                    let ctItem = createContactItem(data[i]);
                    listContact.appendChild(ctItem);
                }
            }
        }
    }
    xhr.open('GET', '/api/chat/contacts', true);
    xhr.send(null);
}

function showChatContacts() {
    let listContact = document.getElementById('list-contacts');
    
    if (listContact) {
        listContact.classList.toggle('contact-hidden');
    }
}

function searchContact(keyword) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let dataRes = JSON.parse(xhr.responseText);
            let listContact = document.querySelector('#list-contacts .list-items');

            listContact.innerHTML = '';

            if (dataRes && dataRes.success && listContact) {
                let data = dataRes.data;

                if (data.length > 0) {
                    for (let i=0; i<data.length; i++) {
                        let ctItem = createContactItem(data[i]);
                        listContact.appendChild(ctItem);
                    }
                } else {
                    let ctItem = createContactItem({
                        fullName: 'Không tìm thấy'
                    });
                    listContact.appendChild(ctItem);
                }
            }
        }
    }
    xhr.open('GET', '/api/chat/search?keyword=' + keyword, true);
    xhr.send(null);
}

document.addEventListener("DOMContentLoaded", function(event) {
    getChatContacts();
});