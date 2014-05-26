/**
 * Utilitários js
 * @author Eder Franco
 * @since: v1.8 (26/05/2014)
 * @version 1.0
 */
function Utils(){}

Utils.prototype.teste = function(){
	alert("Classe Utils.");
};

Utils.prototype.checkbrowser = function(){
	
	var browser = {name: "",version: ""};
	//Detect browser and write the corresponding name
	if (navigator.userAgent.search("MSIE") >= 0){
	    var position = navigator.userAgent.search("MSIE") + 5;
	    var end = navigator.userAgent.search("; Windows");
	    var version = navigator.userAgent.substring(position,end);
	    browser.name = "IE";
	    browser.version = version;
	}
	else if (navigator.userAgent.search("Chrome") >= 0){
	    var position = navigator.userAgent.search("Chrome") + 7;
	    var end = navigator.userAgent.search(" Safari");
	    var version = navigator.userAgent.substring(position,end);
	    browser.name = "Chrome";
	    browser.version = version;
	}
	else if (navigator.userAgent.search("Firefox") >= 0){
	    var position = navigator.userAgent.search("Firefox") + 8;
	    var version = navigator.userAgent.substring(position);
	    browser.name = "Firefox";
	    browser.version = version;
	}
	else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0){//<< Here
	    var position = navigator.userAgent.search("Version") + 8;
	    var end = navigator.userAgent.search(" Safari");
	    var version = navigator.userAgent.substring(position,end);
	    browser.name = "Safari";
	    browser.version = version;
	}
	else if (navigator.userAgent.search("Opera") >= 0){
	    var position = navigator.userAgent.search("Version") + 8;
	    var version = navigator.userAgent.substring(position);
	    browser.name = "Opera";
	    browser.version = version;
	}
	else{
		browser.name = "Outros";
		browser.version = "";
	}
	
	return browser;
};


