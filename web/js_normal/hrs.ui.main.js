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
		initGlobalTimers();
		
		$("#importMonth").click(function(){
			initImport();
		});
		
		/*
		$(".refreshDay").click(function(){
			//TODO: Verificar bug neste botão quando muda o mês
			
			alert(this);
			
			//Realizar a importação/atualização manual de um dia específico
			var dateId = $(this).attr("id");
			var cYear = currentDate.getFullYear();
			var fulldate = dateId + "/"+cYear;
			var cDay = fulldate.substr(0,2);
			var cMonth = fulldate.substr(3,2);
			cMonth = parseInt(cMonth) - 1;
			var idImg = "#ref"+dateId;
			importAhgora(cMonth,cYear,cDay);
			
		});
		*/
		
		$("#about-button").click(function(e){
			openLightbox("#about-lightbox");
		});
		
		$("#current-month").click(function(){
			var date = new Date();
			currentDate.setMonth( date.getMonth());
			buildMonth();
		});
		
		$("#revisarPermissoes").click(function(){
			notif.checkPermissionDirect();
		});
		
		$("#closeSettings").click(function(){
			//document.getElementById('alarm-sound-tardis').stop();
			//$('#alarm-sound-tardis').stop();
		});
	
		/*
		var cBrowser = utils.checkbrowser();
		if(cBrowser.name == "Chrome"){
			$("#revogarPermissoes").show();
		}
		$("#revogarPermissoes").click(function(){
			location.href = "chrome://settings/contentExceptions#notifications";
		});
		*/
	};
	
	window.updateDay = function(dateId){
		
		//Realizar a importação/atualização manual de um dia específico
		//var dateId = $(this).attr("id");
		var cYear = currentDate.getFullYear();
		var fulldate = dateId + "/"+cYear;
		var cDay = fulldate.substr(0,2);
		var cMonth = fulldate.substr(3,2);
		var askedMonth = dateId.substr(3,2);
		//alert(askedMonth);
		cMonth = parseInt(askedMonth);
		
		//if(parseInt(cDay) < 11){
			//TODO: Verificar direito o fucionamento disso com a pessagem dos meses.
			cMonth = parseInt(askedMonth) - 1;
			alert(cMonth);
		//}
		
		/*
		if(parseInt(cDay) >= 31 && parseInt(cDay) >=11 && parseInt(askedMonth) != ){
			cMonth = parseInt(cMonth);
		} else {
			cMonth = parseInt(cMonth) - 1;
		}
		*/
		
		//alert(cMonth);
		//alert(cDay);
		//alert(cYear);
		//var idImg = "#ref"+dateId;
		importAhgora(cMonth,cYear,cDay);
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
				
			//url_import = "http://localhost/uPonto/testes/fake.php";
				
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
								
								
								day = parseInt(day);
								dia = parseInt(dia);
								
								if(day == 0 || day == dia){
									var batidas = dados[j].batidas.registros;
									var timeRowDate = rowDate.getTime();
									var dayExists = localStorage.getItem(timeRowDate);

									//alert(day);
									//alert(dia);
									//alert(day == dia);
									//alert(dayExists);

									//Não vai sobrescrever registros que já existem, exceto quado se trata de uma atualização por dia.
									if(dayExists == null || day == dia){
										//alert("teste");
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
				
				//Fecha lightbox
				closeLightbox("#perform-update");
				
			}, "json").fail(function() {
				
				closeLightbox("#perform-update");
				openLightbox("#error-update");
			}).done(function(){
				//window.location.reload();
				buildMonth();
				initNotifTimer();
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
	
	function checkGeneralTimers(){
		//checkGeneralTimers(exitDate,dif2Calc);
		
		//importAhgora(cMonth,cYear,cDay);
	}
	
	function initGlobalTimers(){
	
		var curDate = new Date();
		var cYear = curDate.getFullYear();
		var cDay = curDate.getDay();
		var thisDay = curDate.getDate();
		var cMonth = curDate.getMonth();
		var ccDate = new Date(cYear, cMonth, thisDay);
		var currDataInfo = currentMonth.getRowInfo(ccDate);
		var entrada = currDataInfo.entrada;
		
		var cHour = curDate.getHours();
		var cMin = curDate.getMinutes();
		var cSec = curDate.getSeconds();
		
		/*
		if(!entrada || entrada == ""){
			var condM = ((parseInt(cMin) % 5) == 0);
			var condS = (parseInt(cSec) == 0);
			
			if(parseInt(cHour) > 7 && condM && condS){
				var mensagem = "Bom dia! Você já registrou seu ponto hoje?";
				notificationGeral(mensagem,"default");
			}
		} else 
		*/
		if(parseInt(cMin) == 59 && parseInt(cSec) == 0){
			importAhgora(cMonth,cYear,thisDay);
		}
		
		var t = setTimeout(function(){
	    	initGlobalTimers();
	    },500);
		
	}
	
	function initNotifTimer(){
		
		initGlobalTimers();
	
		var _dateHelpers = hrs.helpers.dateTime;
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
		
		var almoco = currDataInfo.almoco;
		var ida_almoco = currDataInfo.ida_almoco;
		var volta_almoco = currDataInfo.volta_almoco;
		var volta_almoco_estimada = currDataInfo.volta_almoco_estimada;
		var volta_almoco_estimada_time = currDataInfo.volta_almoco_estimada_time;
		var _dateHelpers = hrs.helpers.dateTime;
		//console.log(volta_almoco_estimada);
		//console.log(volta_almoco_estimada_time);
		//_dateHelpers.formatDate(dateInfo.ida_almoco, '#h:#m'),
		
		/*
		saidaAlmocoEstimada  
		saidaAlmocoReal 
		retornoAlmoco 
		retornoAlmocoTimer
		*/
		$("#saidaAlmocoEstimada").html("12:00");//Mudar isso por um cálculo depois, feito a partir das configurações.
		var saidaConteudo;
		if(ida_almoco.length > 0){
			saidaConteudo = ida_almoco;
		} else {
			saidaConteudo = "-";
		}
		$("#saidaAlmocoReal").html(saidaConteudo);
		
		var retornoConteudo;
		if(volta_almoco_estimada.length > 0){
			retornoConteudo = volta_almoco_estimada;
		} else {
			retornoConteudo = "-";
		}
		$("#retornoAlmoco").html(retornoConteudo);
		$("#retornoAlmocoReal").html("-");
		
		//console.log(volta_almoco_estimada_time);
		
		if((volta_almoco == null || volta_almoco == "undefined" || volta_almoco == "") && ida_almoco.length > 0){
			var almocoBackDate = new Date(volta_almoco_estimada_time.getYear(), volta_almoco_estimada_time.getMonth(), volta_almoco_estimada_time.getDay(), volta_almoco_estimada_time.getHours(), volta_almoco_estimada_time.getMinutes(), 0, 0);
			$("#retornoAlmoco").html(retornoConteudo);
			$("#retornoAlmocoTimer").css("color","green");
			$("#retornoAlmocoReal").html("-");
			var difAlmoco = _dateHelpers.getTimeDiff(volta_almoco_estimada_time,curDate);
			var dif2Calc2 = difAlmoco.getTime();
			updateHoraAlmoco(volta_almoco_estimada_time,dif2Calc2);
			//console.log(dif2Calc2);
		} else {
			$("#retornoAlmocoTimer").css("color","black");
			$("#retornoAlmocoReal").html(volta_almoco);
			$("#retornoAlmocoTimer").html("-");
			$("#retornoAlmoco").html("-");
		}

		var saida = currDataInfo.saida;
		var entrada = currDataInfo.entrada;
		if((saida == null || saida == "undefined" || saida == "") && entrada.length > 0){
			$("#proxSaidaExtimada").html(saidaEsperada);
			$("#proxSaidaTimer").css("color","red");
			var dif = _dateHelpers.getTimeDiff(exitDate,curDate);
			var dif2Calc = dif.getTime();
			updateHoraSaida(exitDate,dif2Calc);
		} else {
			$("#proxSaidaTimer").css("color","black");
			$("#saidaTimeLabel").html("Tempo até saída: ");
			$("#proxSaidaExtimada").html("-");
			$("#proxSaidaTimer").html("-");
		}
	}
	
	function notificationTeste(tempo){
		//notif.checkPermissionDirect();
		var browser = utils.checkbrowser();
		
		if(browser.name == "Chrome" || browser.name == "Firefox"){
			//checkPermission();
			
			var title = "Controle de Banco de Horas";
			var options = {
					  body: "Faltam "+tempo+" minuto(s) para sua saída. Fique atento!",
					  icon: "res/icon.png"
					};
			notif.create(title,options,null);
			
		} else {
			alert("Notificações não implementadas para esta versão do seu browser.");
		}
		
	}
	
	function notificationGeral(mensagem,sound){
		//notif.checkPermissionDirect();
		var browser = utils.checkbrowser();
		
		if(browser.name == "Chrome" || browser.name == "Firefox"){
			//checkPermission();
			
			var title = "Controle de Banco de Horas";
			var options = {
					  body: mensagem,
					  icon: "res/icon.png"
					};
			notif.create(title,options,null,sound);
			
		} else {
			alert("Notificações não implementadas para esta versão do seu browser.");
		}
		
	}
	
	function updateHoraAlmoco(exitDate,dif2Calc){
		//notificationTeste();
		var curDate = new Date();
		var _dateHelpers = hrs.helpers.dateTime;
		
		
		if(dif2Calc > 0){
			$("#retornoAlmocoTimer").css("color","green");
			$("#retornoAlmocoTimerLabel").html("Tempo até retorno: ");
			var dif = _dateHelpers.getTimeDiff(exitDate,curDate);
			dif2Calc = dif.getTime();
		} else {
			$("#retornoAlmocoTimer").css("color","red");
			$("#retornoAlmocoTimerLabel").html("Tempo de atraso: ");
			var dif = _dateHelpers.getTimeDiff(curDate,exitDate);
		}
	    var difTime = dif.getTime();
		
	    var teste = new Date(difTime);
	    var h = dif.getHours();
	    var m = teste.getMinutes();
	    var s = teste.getSeconds();
	    
		if(dif2Calc > 0 && parseInt(h) == 0){
		
			
			switch(m){
			case (5):
				if(s == 59){
					var mensagem = "Faltam "+m+" minuto(s) para encerrar seu horário de almoço! Fique atento.";
					notificationGeral(mensagem,"five");
				}
				break;
			case 0:
				if(s == 59){
					var mensagem = "Falta menos de um minuto minuto(s) para encerrar seu horário de almoço!";
					notificationGeral(mensagem,"default");
				} else if(s == 00){
					var mensagem = "Seu horário de almoço já encerrou! Você deve bater seu ponto imediatamente!!!";
					notificationGeral(mensagem,"default");
				}
				break;
			}
	    } else if (dif2Calc < 0 && parseInt(h) == 0){
		
			if(m > 0 && s == 00){
				var mensagem = "Seu horário de almoço já encerrou! Você deve bater seu ponto imediatamente!!!";
				notificationGeral(mensagem,"default");
			}
		}
	    
	    h = fomartPartTime(h);
	    m = fomartPartTime(m);
	    s = fomartPartTime(s);
	    	
	    var faltaParaSairShow = h+":"+m+":"+s;
	    $("#retornoAlmocoTimer").html(faltaParaSairShow);

	    var t = setTimeout(function(){
	    	updateHoraAlmoco(exitDate,dif2Calc);
	    },500);
	}
	
	function updateHoraSaida(exitDate,dif2Calc){
		//notificationTeste();
		var curDate = new Date();
		var _dateHelpers = hrs.helpers.dateTime;
		
		
		if(dif2Calc > 0){
			$("#saidaTimeLabel").html("Tempo até saída: ");
			$("#proxSaidaTimer").css("color","red");
			var dif = _dateHelpers.getTimeDiff(exitDate,curDate);
			dif2Calc = dif.getTime();
		} else {
			$("#saidaTimeLabel").html("Hora extra: ");
			$("#proxSaidaTimer").css("color","green");
			var dif = _dateHelpers.getTimeDiff(curDate,exitDate);
		}
	    var difTime = dif.getTime();
		
	    var teste = new Date(difTime);
	    var h = dif.getHours();
	    var m = teste.getMinutes();
	    var s = teste.getSeconds();
	    
	    if(dif2Calc > 0 && parseInt(h) == 0){
			switch(m){
			case 30:
				if(s == 59){
					//notificationTeste(m);
					var mensagem = "Faltam "+m+" minuto(s) para sua saída. Fique atento!";
					notificationGeral(mensagem,"default");
				}
				break;
			case 20:
				if(s == 59){
					//notificationTeste(m);
					var mensagem = "Faltam "+m+" minuto(s) para sua saída. Fique atento!";
					notificationGeral(mensagem,"default");
				}
				break;
			case 10:
				if(s == 59){
					var mensagem = "Faltam "+m+" minuto(s) para sua saída. Fique atento!";
					notificationGeral(mensagem,"ten");
					//notificationTeste(m);
				}
				break;
			case 5:
				if(s == 59){
					if(m == 5){					
						var mensagem = "Faltam "+m+" minuto(s) para sua saída. Fique atento!";
						notificationGeral(mensagem,"five");
					} else {
						//notificationTeste(m);
						var mensagem = "Faltam "+m+" minuto(s) para sua saída. Fique atento!";
						notificationGeral(mensagem,"chimes");
					}
				}
				break;
			case 0:
				if(s == 59){
					notificationTeste(m);
				}
				break;
			}
	    }
	    
	    h = fomartPartTime(h);
	    m = fomartPartTime(m);
	    s = fomartPartTime(s);
	    	
	    var faltaParaSairShow = h+":"+m+":"+s;
	    $("#proxSaidaTimer").html(faltaParaSairShow);

	    var t = setTimeout(function(){
	    	updateHoraSaida(exitDate,dif2Calc);
	    },500);
	}
	function fomartPartTime(part){
		if(part < 10){
			part = "0"+ part;
		}
		return part;
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
			//var data = localStorage;
			//$.toJSON(data);
			//console.log(data);
			//utils.json2csv(data, "Teste", false);
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