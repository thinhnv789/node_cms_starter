/* Function confirm delete item */
function confirmDelete(selector, text, url) {
	console.log('selector', selector);
    
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

/* Document ready */
$(document).ready(function() {

})
