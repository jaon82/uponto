hrs = window.hrs || {};
hrs.ui = window.hrs.ui || {};
utils = new Utils();

hrs.ui.main = (function($, helpers, dao){
	var public = {};
	
	var currentDate = null,
		currentMonth = null,
		notif = null,
		$container = null,
		lightboxIndex = 3;
	
	public.init = function($elm){
		$container = $elm;
		currentDate = new Date();
		buildMonth();
		settings();
		lightbox();
		monthInformation();
		importExport();
		holidays();
		initNotifications();
		exportPdf();
		initNotifTimer();
		//initImport();
		//checkPermission();
		
		$("#importMonth").click(function(){
			initImport();
		});
		
		$(".refreshDay").click(function(){
			//TODO: Verificar bug neste botão quando muda o mês
			
			//Realizar a importação/atualização manual de um dia específico
			var dateId = $(this).attr("id");
			var cYear = currentDate.getFullYear();
			var fulldate = dateId + "/"+cYear;
			var cDay = fulldate.substr(0,2);
			var cMonth = fulldate.substr(3,2);
			cMonth = parseInt(cMonth) - 1;
			//alert(fulldate);
			//alert(cMonth);
			
			var idImg = "#ref"+dateId;
			//alert(idImg);

			importAhgora(cMonth,cYear,cDay);
			
		});
		
		$("#current-month").click(function(){
			var date = new Date();
			currentDate.setMonth( date.getMonth());
			buildMonth();
		});
	};
	
	function initImport(){
		currentMonth = new hrs.ui.month(currentDate.getMonth(), currentDate.getFullYear());
		var cMonth = currentDate.getMonth();
		var cYear = currentDate.getFullYear();
		importAhgora(cMonth,cYear,null);
	}
	
	function importAhgora(month,year,day){
		openLightbox("#perform-update");

		var dia = currentDate.getDate();
		if(dia > 11){
			month = parseInt(month) + 1;
		} 
		
		//month = month.toString();
		//if(month.length == 1){
			month = "0"+month;
		//}
		//var monthYear = month+"-"+year;
				
		var url_import = "http://khi.by/projetos/pontoconn/";
		
		
		//1. Verificar se já houve importação do mês e ano desejado
		//var info = dao.getAgoraLog(monthYear);
		var _helpers = hrs.helpers,
		_dateHelpers = hrs.helpers.dateTime;
		
		//Se não foi importado ainda, realiza a importação
		//if(info == null || info.imported == 0){
			
			//Pega as configurações
			var set = dao.loadSettings();
			var matricula = set.matricula;
			var senha = set.senha;
			var empresa = set.empresa;
			if(day == null){
				day = 0;
			}
			
			if(matricula == null || senha == null || empresa == null){
				//console.log("Informe Matricula, Senha e Empresa nas configuracoes para realizar a importacao.");
				//console.log("Importação falhou.");
				var msg = "Informe sua Matrícula, Senha e Empresa nas Configurações antes de realizar a importação.";
				$("#msg-lightbox-content").html(msg);
				closeLightbox("#perform-update");
				openLightbox("#msg-lightbox");
				
			} else {
			//TODO: remover isso depois que for criado o cache na API
			//alert(month);
			//if(day > 0 && day <=15){
				//month = parseInt(month) -1;
				//month = "0"+month;
			//}
			
			//alert(day);
			//alert(month);
			
			url_import+= "?m="+matricula+"&s="+senha+"&e="+empresa+"&mes="+month+"&ano="+year+"&day="+day+"&type=json&di=0";
				
			//alert(url_import);
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
								
								//monthYear2 = mes+"-"+ano;
								
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
								//var dif = _dateHelpers.getTimeDiff(ccDate,rowDate);
								//var intDif = parseInt(dif);
								
								//alert("Linha atual - "  + rowDate);
								//alert("Hoje - "  + curDate);
								//alert("Dif"  + dif);
								//alert(intDif);
								
								/*
								- Só vai armazenar a importação se não foi uma importação por dia; ou
								- Se foi uma importação por dia, só vai alterar o dia solicitado.
								*/
								if(day == 0 || day == dia){
									var batidas = dados[j].batidas.registros;
									var timeRowDate = rowDate.getTime();
									localStorage.getItem(timeRowDate);
									
									//Não vai sobrescrever registros que já existem, exceto quado se trata de uma atualização por dia.
									if(timeRowDate != null && day == dia){
										var jsonInfo = {
											entrada: (!batidas[0])?0:_dateHelpers.parseDateTime(batidas[0], rowDate),
											ida_almoco: (!batidas[1])?0:_dateHelpers.parseDateTime(batidas[1], rowDate),
											volta_almoco: (!batidas[2])?0:_dateHelpers.parseDateTime(batidas[2], rowDate),
											saida: (!batidas[3])?0:_dateHelpers.parseDateTime(batidas[3], rowDate),
											vpn: 0,
											obs: "Batidas originais: "+texto,
											ausent: false
										};
										
										dao.storeDate(rowDate, jsonInfo);
									}
								}
								//exit;
							}
							
						}
					}
				
				} else {
					//console.log("Importação falhou.");
					closeLightbox("#perform-update");
					openLightbox("#error-update");
				}
				//TODO: Ainda não setei a flag do status da atualização já ter ocorrido
				//var dataAtual = new Date();
				//dao.setAhgoraLog(monthYear2,1,dataAtual);
				
				//Fecha lightbox
				closeLightbox("#perform-update");
				
			}, "json").fail(function() {
				
				closeLightbox("#perform-update");
				openLightbox("#error-update");
			});
			
			}//Fim - teste temporário se os dados de login existem
			
	
		//}
		
	}
	
	function testeNot(){
		alert("Clicou na parada e tal...");
	}
	
	function initNotifications(){
		notif = new DesktopNotifications();
	}
	
	function initNotifTimer(){
		//1. Busca a hora de saída estimada do dia atual
		var curDate = new Date();
		var ccM = curDate.getMonth();
		var ccY = curDate.getFullYear();
		var ccD = curDate.getDate();
		var ccDate = new Date(ccY, ccM, ccD);
		var currDataInfo = currentMonth.getRowInfo(ccDate);
		var saidaEsperada = currDataInfo.expectedExit;
		var hSaida = saidaEsperada.substring(0,2);
		var mSaida = saidaEsperada.substring(3,5);
		var exitDate = new Date(ccY, ccM, ccD, hSaida, mSaida, 0, 0);
		$("#proxSaidaExtimada").html(saidaEsperada);
		updateHoraSaida(exitDate);
	}
	
	function notificationTeste(){
		
		var browser = utils.checkbrowser();
		
		if(browser.name == "Chrome" || browser.name == "Firefox"){
			//checkPermission();
			
			var title = "Controle de Banco de Horas";
			var options = {
					  body: "Aqui vai o conteúdo da notificação",
					  icon: "res/icon.png"
					};
			notif.create(title,options,null);
			
		} else {
			alert("Notificações não implementadas para esta versão do seu browser.");
		}
		
	}
	
	function updateHoraSaida(exitDate){
		//notificationTeste();
		var curDate = new Date();
		var _dateHelpers = hrs.helpers.dateTime;
		var dif = _dateHelpers.getTimeDiff(exitDate,curDate);
	    var faltaParaSairShow = _dateHelpers.formatDate(dif, '#h:#m:#s');
	    $("#proxSaidaTimer").html(faltaParaSairShow);
	    
	    var t = setTimeout(function(){
	    	
	    	updateHoraSaida(exitDate);
	    	
	    },500);
	}

	
	function buildMonth(){
		currentMonth = new hrs.ui.month(currentDate.getMonth(), currentDate.getFullYear());
		currentMonth.setDao(dao);
		currentMonth.setUpdatedRowCallback(updateInfo);
		currentMonth.print($container);
		
		//initImport();
		
		$("#main-table tr").each(function(){
			var $row = $(this);
			formatValue($row.find('.total, .excedente'), $row.find('.excedente').html());
		});
		
		updateInfo();
	}
	
	function updateInfo($row, rowData){
		var totals = dao.calculateTotals(currentDate.getMonth(), currentDate.getFullYear());
		$("#extra").html(totals.extra.toString());
		$("#extra-month").html(totals.extraMonth.toString());
		$("#month-name").html(helpers.dateTime.formatDate(currentDate, '#MM / #yyyy'));
		var mesLabel = helpers.dateTime.formatDate(currentDate, '#MM / #yyyy');
		var importButton = "Importar "+mesLabel+" (Sistema Ahgora)";
		$("#importMonth").attr("value",importButton);
		
		formatValue($("#extra"), totals.extra.toString());
		formatValue($("#extra-month"), totals.extraMonth.toString());
		
		if(rowData != undefined){
			formatValue($row.find('.total, .excedente'), rowData.excedente);
		}
		
		$("#entrance-avg").html(helpers.dateTime.formatDate(totals.avgEntrance, '#hh#m'));
		$("#exit-avg").html(helpers.dateTime.formatDate(totals.avgExit, '#hh#m'));

		if(totals.totalExtraDays >= 0){
			$("#positive-days")
				.show()
				.find("#days-off").html(totals.totalExtraDays);

			$("#negative-days").hide();
		} else {
			$("#negative-days")
				.show()
				.find("#days-to-pay").html(totals.totalExtraDays);
				
			$("#positive-days").hide();
		}

		$("#ausent-days").html(totals.ausentDays);
	}
	
	function formatValue($target, value) {
		var isNegative = (typeof value == 'string') ? value.indexOf('-') > -1 : value < 0; 
		
		var fn = isNegative ? 'addClass' : 'removeClass';
		$target[fn]('negative-hours');
	}
	
	function settings(){
		var settings = dao.loadSettings();
		$("#total-work").val(settings.totalWork).change(saveSettings);
		$("#lunch-time").val(settings.lunchTime).change(saveSettings);
		$("#initial-balance").val(settings.initialBalance).change(saveSettings);
		
		$("#matricula").val(settings.matricula).change(saveSettings);
		$("#senha").val(settings.senha).change(saveSettings);
		$("#empresa").val(settings.empresa).change(saveSettings);

		var $utilDaysChecks = $("div.utilDays input:checkbox");
		for(var i = 0; i < settings.utilDays.length; i ++){
			$utilDaysChecks.filter('[value=' + settings.utilDays[i] + ']').attr('checked', 'checked');
		}

		$utilDaysChecks.change(saveSettings);
	}
	
	function openLightbox(id){
		var $elm = $(id); 
		$elm.fadeIn().css('z-index', lightboxIndex ++);
		
		var l = ($(window).width() - $elm.width()) / 2,
			t = ($(window).height() - $elm.height()) / 2;
		
		$elm.css({top: t+ 'px', left: l + 'px'});
	}
	
	function lightbox(){
		
		$('.open-lightbox').click(function(e){
			e.preventDefault();
			openLightbox($(this).attr('href'));
		});
		
		$('.lightbox .close').click(function(e){
			$(this).closest('.lightbox').fadeOut().css('z-index', 'auto');
		});
	}
	
	function closeLightbox(id){
		$(id).closest('.lightbox').fadeOut().css('z-index', 'auto');
	}
	
	function saveSettings(e, holidays){

		var utilDaysChecked = [];

		$("input.utilDay:checked").each(function(){
			utilDaysChecked.push(this.value);
		});

		dao.saveSettings({
			'totalWork': $("#total-work").val(),
			'lunchTime': $("#lunch-time").val(),
			'initialBalance': $("#initial-balance").val(),
			'matricula': $("#matricula").val(),
			'senha': $("#senha").val(),
			'empresa': $("#empresa").val(),
			'holidays': holidays || hrs.ui.holidays.getHolidays(),
			'utilDays': utilDaysChecked
		});

		buildMonth();
	}
	
	function monthInformation(){
		$("#prev-month").click(function(){
			currentDate.setMonth( currentDate.getMonth() - 1);
			buildMonth();
		});
		
		$("#next-month").click(function(){
			currentDate.setMonth( currentDate.getMonth() + 1);
			buildMonth();
		});
	}
	
	function saveImportedData(file){
		var fr = new FileReader();
        fr.onload = function(e){
        	var content = e.target.result;
    		dao.importData(content);
    		buildMonth();
        };
        
        fr.readAsText(file, 'UTF-8');
        setTimeout(function(){location.reload();}, 500);
	}
	
	function importExport(){

		$("#link-export").click(function(){
			$("#output-export").val(dao.exportData())[0].select();
		});

		$("#output-export").click(function(){
			this.select();
		})

		$("#import-data").click(function(e){
			$("#inputfile-import-data").click();
		});
		
		$('#proced-import').click(function(){
			saveImportedData($("#confirm-import")[0].file);
		});

		$("#inputfile-import-data").change(function(e){
			var files = e.target.files;
			
			if(files.length == 0) return;
			$("#confirm-import")[0].file = files[0];
			$("#inputfile-import-data").val('');
			openLightbox("#confirm-import");
		});
	}
	
	function holidays(){
		hrs.ui.holidays.init({ $elem: $("#holidays-list"), 
							   holidays: dao.getHolidays(),
							   callback: function(holidays){
								   saveSettings(null, holidays);
							   }});
	}

	function exportPdf(){
		$("a.export-pdf").click(function(e){
			e.preventDefault();
			window.print();
		});
	}

	return public;
})(jQuery, hrs.helpers, hrs.dao);


$(function(){
	hrs.ui.main.init($("#main-table"));
})