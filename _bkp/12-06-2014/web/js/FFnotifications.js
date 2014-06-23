/**
 * Notificações de Desktop para Mozilla Firefox
 * @author Eder Franco
 * @since: v1.8 (26/05/2014)
 * @version 1.0
 */
var permission = null;
var clickUrl = null;
function FFnotifications(){
	permission = this.checkPermission();
	//console.log(permission);
}

FFnotifications.prototype.teste = function(){
	alert("Classe FFnotifications.");
};

/**
 * Verifica se o browser oferece suporte para notificações e se o usuário já concedeu permissão
 * Baseado em: 	https://developer.mozilla.org/en-US/docs/Web/API/notification
 * 				https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
 * 				https://developer.mozilla.org/en-US/docs/WebAPI/Using_Web_Notifications
 */
FFnotifications.prototype.checkPermission = function(){
	
	var result = {isOK: false, msg: ""};
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
	  result.msg = "Este browser não oferece suporte para notificações de desktop";
	  result.isOK = false;
	}
	// Let's check if the user is okay to get some notification
	else if (Notification.permission === "granted") {
	// If it's okay let's create a notification
	  result.msg = "Notificações suportadas e permissão concedida pelo usuário.";
	  result.isOK = true;
	}
	
	// Otherwise, we need to ask the user for permission
	// Note, Chrome does not implement the permission static property
	// So we have to check for NOT 'denied' instead of 'default'
	else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function (permission) {
		
		  // Whatever the user answers, we make sure we store the information
		  if(!('permission' in Notification)) {
			Notification.permission = permission;
		  }
		
		  // If the user is okay, let's create a notification
		  if (permission === "granted") {
			  result.msg = "Notificações suportadas e permissão concedida pelo usuário.";
			  result.isOK = true;
		  }
		});
	}
	
	return result;
};

FFnotifications.prototype.create = function(title,options, url){
	if(title == null){
		title = "Controle de Banco de Horas";
	}
	var notification = new Notification(title, options);
	if(url != null){
		clickUrl = url;
		notification.onclick = notificationClick;
	}
};

//Funções locais
function notificationClick(){
	if(clickUrl == null){
		clickUrl = "http://khi.by/projetos/uponto/web/";
	}
	window.open(clickUrl);
}

