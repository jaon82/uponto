/**
 * Classe de integração com a API do sistema Ahgora
 * @author Eder Franco
 * @since: v1.11 17/06/2014)
 * @version 1.0
 */

function Ahgora(matricula,senha,empresa,helpers,dao,openAlert,closeAlert,monthFunc,timerFunc){
	
	IMPORT_URL = "http://khi.by/projetos/pontoconn/";
	//Fake URL for local testing: "http://localhost/uponto/testes/fake.php";
	var AHGORA_MATRICULA = null;
	var AHGORA_SENHA = null;
	var AHGORA_EMPRESA = null;
	
	_dao = dao;
	_helpers = helpers;
	_dateHelpers = _helpers.dateTime;
	openLightbox = openAlert;
	closeLightbox = closeAlert;
	buildMonth = monthFunc;
	initNotifTimer = timerFunc;
	
	if(matricula == null || senha == null || empresa == null){
		var msg = "Informe sua Matrícula, Senha e Empresa nas Configurações antes de realizar a importação.";
		$("#msg-lightbox-content").html(msg);
		closeLightbox("#perform-update");
		openLightbox("#msg-lightbox");
	} else {
		AHGORA_MATRICULA = matricula;
		AHGORA_SENHA = senha;
		AHGORA_EMPRESA = empresa;
		IMPORT_URL+= "?m="+AHGORA_MATRICULA+"&s="+AHGORA_SENHA+"&e="+AHGORA_EMPRESA;
	}
};

Ahgora.prototype.teste = function(){
	alert("Classe Ahgora.");
};

Ahgora.prototype.checkSettings = function(){
	if(matricula == null || senha == null || empresa == null){
		var msg = "Informe sua Matrícula, Senha e Empresa nas Configurações antes de realizar a importação.";
		$("#msg-lightbox-content").html(msg);
		closeLightbox("#perform-update");
		openLightbox("#msg-lightbox");
		return false;
	} else {
		return true;
	}
};

Ahgora.prototype.import = function (month,year,day){
	
	//Open update dialog
	openLightbox("#perform-update");
	
	//Check if all the settings are set
	this.checkSettings();
	
	var currentDate = new Date();
	var dia = currentDate.getDate();
	if(day == null && dia > 11){
		month = parseInt(month) + 1;
	} 
	month = parseInt(month);
	if(month == 0){
		month = 1;
	}
	if(parseInt(month) < 10){
		month = "0"+month;
	}
	if(day == null){
		day = 0;
	}
	var url_import = IMPORT_URL + "&mes="+month+"&ano="+year+"&day="+day+"&type=json&di=0";
	
	//Logs the complete import url
	console.log(url_import);
	
	$.get(url_import, function( resposta, statusText, xhr) {
		
		if(xhr.status != 200){
			closeLightbox("#perform-update");
			openLightbox("#error-update");
			
		} else if(resposta){//Se retornou algo da API
			
			var dados;
			var monthYear2;
			for(var i = 0; i <= resposta.length; i++){
				dados = resposta[i];
				
				for(var j in dados){
					
					var texto = dados[j].batidas.texto;
					
					//Somente criar registro para o banco de dados SE houve batidas no dia
					if(texto.length > 0){
						
						var data = dados[j].data;
						var dia = data.substr(0,2);
						var mes = data.substr(3,2);
						var ano = data.substr(6,4);
						
						if(dia < 10){
							dia = dia.substr(1,1);
						}
						
						if(mes < 10){
							mes = mes.substr(1,1);
						}
						mes = parseInt(mes) - 1;
						
						var rowDate = new Date(ano, mes, dia);
						var curDate = new Date();
						var ccM = curDate.getMonth();
						var ccY = curDate.getFullYear();
						var ccD = curDate.getDate();
						var ccDate = new Date(ccY, ccM, ccD);
						
						//Só vai armazenar a importação se não foi uma importação por dia; ou
						//Se foi uma importação por dia, só vai alterar o dia solicitado.
						day = parseInt(day);
						dia = parseInt(dia);
						
						if(day == 0 || day == dia){
							var batidas = dados[j].batidas.registros;
							var timeRowDate = rowDate.getTime();
							var dayExists = localStorage.getItem(timeRowDate);

							//Não vai sobrescrever registros que já existem, exceto quado se trata de uma atualização por dia.
							if(dayExists == null || day == dia){
								var jsonInfo = {
									entrada: (!batidas[0])?0:_dateHelpers.parseDateTime(batidas[0], rowDate),
									ida_almoco: (!batidas[1])?0:_dateHelpers.parseDateTime(batidas[1], rowDate),
									volta_almoco: (!batidas[2])?0:_dateHelpers.parseDateTime(batidas[2], rowDate),
									saida: (!batidas[3])?0:_dateHelpers.parseDateTime(batidas[3], rowDate),
									vpn: 0,
									obs: "Batidas originais: "+texto,
									ausent: false
								};
								//Armazena no localStorage
								_dao.storeDate(rowDate, jsonInfo);
								
							}//Se o dia não possui registro, ou se foi uma importação por dia
						}//Se foi solicitado um dia específico, ou se o dia está setado como Zero.
					}//Se retornou algo da API
					
				}
			}
			
		} else {//Se ocorreu erro.
			console.log("Importação falhou.");
			closeLightbox("#perform-update");
			openLightbox("#error-update");
			
		}//Se a resposta veio com sucesso.
		closeLightbox("#perform-update");
		
	}, "json").fail(function() {//Se ocorreu erro na requisição
		closeLightbox("#perform-update");
		openLightbox("#error-update");
		
	}).done(function(){
		//Recria o mês ao finalizara  importação
		buildMonth();
		//Chama novamente as funções de reset dos timers
		//initNotifTimer();
		window.location.reload();
	});
}