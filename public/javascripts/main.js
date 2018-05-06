/* Function confirm delete item */
function confirmDelete(selector, text, url) {	
	confirmAgree = function() {
		window.location.href = url;
	}
  
	confirmCancel = function() {
	  let popupConfirm = document.getElementById('popup-confirm');
  
	  if (popupConfirm) {
		$('body').removeClass('overflow-hidden');
		popupConfirm.remove();
	  }
	}
  
	let html = '<div class="content-center-container"><div class="confirm-action-container"><div class="icon icon-question"><i class="fa fa-question-circle"></i></div><div class="confirm-message">' + text + '</div><hr/><div class="confirm-actions"><button class="btn btn-success confirm-agree" onclick="confirmAgree()"><i class="fa fa-check"></i>&nbsp;Đồng ý</button><button class="btn btn-default confirm-disagree" onclick="confirmCancel()"><i class="fa fa-ban"></i>&nbsp;Thoát</button></div></div></div>';
	
	let confirmDialog = document.createElement('div');
	confirmDialog.id = 'popup-confirm';
	confirmDialog.className = 'confirm-action content-center';
	confirmDialog.innerHTML = html;
	
	$('body').append(confirmDialog);
  
	return false;
}

function createHeaderMessageItem(data) {
	let headerMessageItem = document.createElement('li');
	headerMessageItem.innerHTML = '<a href="#"><div class="pull-left"><img class="img-circle" src="' + data.sender.avatarUrl + '" alt="User Image"></div><h4>' + data.sender.fullName + ' (' + data.countUnread + ')<small><i class="fa fa-clock-o"></i> 5 mins</small></h4><p>' + data.latestMessageContent + '</p></a>';
	return headerMessageItem;
}

function getRecentMessages() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			let dataRes = JSON.parse(xhr.responseText);
			console.log('dataRes', dataRes);
			if (dataRes && dataRes.success) {
				let recentMessages = dataRes.data, countUnread = 0;
				let headerMessageCount = document.querySelector('#header-messages .message-count');
				let headerMessageList = document.querySelector('#header-messages .message-list .menu');
				for (let i=0; i<recentMessages.length; i++) {
					let headerMessageItem = createHeaderMessageItem(recentMessages[i]);
					headerMessageList.appendChild(headerMessageItem);
					countUnread += recentMessages[i].countUnread;
				}
				headerMessageCount.textContent = countUnread;
			}
		}
	}
	xhr.open('GET', '/api/chat/recent-messages', true);
	xhr.send();
}

/* Document ready */
$(document).ready(function() {
	/**
	 * Get recent messages
	 */
	getRecentMessages();
})
