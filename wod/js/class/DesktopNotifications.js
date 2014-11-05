/**
 * Notificações para Desktop
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
 * Verifica se o browser oferece suporte para notificações e se o usuário já concedeu permissão
 * Baseado em: 	https://developer.mozilla.org/en-US/docs/Web/API/notification
 * 				https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
 * 				https://developer.mozilla.org/en-US/docs/WebAPI/Using_Web_Notifications
 * 				http://www.w3.org/TR/notifications/
 *				http://blog.sourcebender.com/building-an-html5-application-part2.html (Audio)
 */
DesktopNotifications.prototype.checkPermission = function(){
	
	var result = {isOK: false, msg: ""};
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
	  result.msg = "Este browser nÃ£o oferece suporte para notificaÃ§Ãµes de desktop";
	  result.isOK = false;
	}
	// Let's check if the user is okay to get some notification
	else if (Notification.permission === "granted") {
	// If it's okay let's create a notification
	  result.msg = "NotificaÃ§Ãµes suportadas e permissÃ£o concedida pelo usuÃ¡rio.";
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
			  result.msg = "NotificaÃ§Ãµes suportadas e permissÃ£o concedida pelo usuÃ¡rio.";
			  result.isOK = true;
		  }
		});
	}
	
	return result;
};

DesktopNotifications.prototype.checkPermissionDirect = function(){
	var result = this.checkPermission();
	if(!result.isOK){
		alert(result.msg);
	} else {
		var title = "Controle de Banco de Horas";
		var options = {
				  body: result.msg,
				  icon: "res/icon.png"
				};
		this.create(title,options,null,"tardis");
	}
};

DesktopNotifications.prototype.create = function(title,options,url,sound){
	if(permission.isOK){
		if(title == null){
			title = "Controle de Banco de Horas";
		}
		var notification = new Notification(title, options);
		//notification.onshow = function() { setTimeout(notification.close, 15000) };
		
		if(sound.length > 0){
			if(sound == "default"){
				document.getElementById('alarm-sound').play(); 
			} else {
				switch(sound){
					case "five":
						document.getElementById('alarm-sound-five').play();
						break;
					case "ten":
						document.getElementById('alarm-sound-ten').play();
						break;
					case "chimes":
						document.getElementById('alarm-sound-chimes').play(); 
						break;
					default:
						document.getElementById('alarm-sound-tardis').play();
						break;						
				}
			}
			// play the alarm sound
			//document.getElementById('alarm-sound').play(); 
		}

		if(url != null){
			clickUrl = url;
			notification.onclick = notificationClick;
		}
	} else {
		if(confirm("VocÃª ainda nÃ£o autorizou o uso de notificaÃ§Ãµes.\nDeseja revisar as pemissÃµes?")){
			permission = this.checkPermission();
		}
	}
};

//Funções locais
function notificationClick(){
	if(clickUrl != null){
		window.open(clickUrl);
	}
}

function updateSource(source, src) {
    var source = $(source);
    source.attr('src', src).appendTo(source.parent());
}

