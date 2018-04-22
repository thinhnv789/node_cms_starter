/* Function confirm delete item */
function confirmDelete(text, url) {
    $('body').addClass('overflow-hidden');
  
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
  
    let html = '<div id="popup-confirm" class="confirm-action content-center"><div class="content-center-container"><div class="confirm-action-container"><div class="icon icon-question"><i class="fa fa-question-circle"></i></div><div class="confirm-message">' + text + '</div><hr/><div class="confirm-actions"><button class="btn btn-success confirm-agree" onclick="confirmAgree()"><i class="fa fa-check"></i>&nbsp;Đồng ý</button><button class="btn btn-default confirm-disagree" onclick="confirmCancel()"><i class="fa fa-ban"></i>&nbsp;Thoát</button></div></div></div></div>';
    document.body.innerHTML += html;
  
    return false;
}

/* Document ready */
$(document).ready(function() {

})
