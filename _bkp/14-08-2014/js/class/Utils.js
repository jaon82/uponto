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

Utils.prototype.json2csv = function (JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


