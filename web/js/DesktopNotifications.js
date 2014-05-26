/**
 * Notifica��es para Desktop
 * @author Eder Franco
 * @since: v1.8 (26/05/2014)
 * @version 1.0
 */
var permission = null;
var clickUrl = null;
function DesktopNotifications(){
	permission = this.checkPermission();
	//console.log(permission);
}

DesktopNotifications.prototype.teste = function(){
	alert("Classe DesktopNotifications.");
};

/**
 * Verifica se o browser oferece suporte para notifica��es e se o usu�rio j� concedeu permiss�o
 * Baseado em: 	https://developer.mozilla.org/en-US/docs/Web/API/notification
 * 				https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
 * 				https://developer.mozilla.org/en-US/docs/WebAPI/Using_Web_Notifications
 */
DesktopNotifications.prototype.checkPermission = function(){
	
	var result = {isOK: false, msg: ""};
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
	  result.msg = "Este browser n�o oferece suporte para notifica��es de desktop";
	  result.isOK = false;
	}
	// Let's check if the user is okay to get some notification
	else if (Notification.permission === "granted") {
	// If it's okay let's create a notification
	  result.msg = "Notifica��es suportadas e permiss�o concedida pelo usu�rio.";
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
			  result.msg = "Notifica��es suportadas e permiss�o concedida pelo usu�rio.";
			  result.isOK = true;
		  }
		});
	}
	
	return result;
};

DesktopNotifications.prototype.create = function(title,options, url){
	if(permission.isOK){
		if(title == null){
			title = "Controle de Banco de Horas";
		}
		var notification = new Notification(title, options);
		if(url != null){
			clickUrl = url;
			notification.onclick = notificationClick;
		}
	} else {
		if(confirm("Voc� ainda n�o autorizou o uso de notifica��es.\nDeseja revisar as pemiss�es?")){
			permission = this.checkPermission();
		}
	}
};

//Fun��es locais
function notificationClick(){
	if(clickUrl != null){
		window.open(clickUrl);
	}
}

