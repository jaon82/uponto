hrs = window.hrs || {};
hrs.ui = window.hrs.ui || {};
utils = new Utils();

hrs.ui.main = (function($, helpers, dao){
	var public = {};
	
	var currentDate = null,
		currentMonth = null,
		notif = null,
		ahgora = null,
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
		initAhgora();
		
		$("#importMonth").click(function(){
			initImport();
		});
		
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
			window.location.reload();
		});
		
		var wodpause = false;
		$("#stop-wod").click(function(){
			if(!wodpause){
				document.getElementById('alarm-sound-wod').pause();
				$("#alarm-sound-wod").val("Tocar M˙sica");
				wodpause = true;
			} else {
				document.getElementById('alarm-sound-wod').play();
				$("#alarm-sound-wod").val("Pausar M√∫sica");
				wodpause = false;
			}
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
		
		$("#permAhgora").click(function(){
			
			var check = $(this).is(":checked");
			if(check){
				$("#showAhgora").fadeIn();
			} else {
				$("#showAhgora").fadeOut();
			}
			initAhgora();
		});
		
		$("#permNotif").click(function(){
			
			var check = $(this).is(":checked");
			if(check){
				$("#showNotif").fadeIn();
			} else {
				$("#showNotif").fadeOut();
			}
			
		});
			
	};
	
	function updateScreen(){
		window.location.reload();
	}
	
	/**
	 * Realizar a importaÁ„o/atualizaÁ„o manual de um dia especÌfico
	 */
	window.updateDay = function(dateId){
		var cYear = currentDate.getFullYear();
		var fulldate = dateId + "/"+cYear;
		var cDay = fulldate.substr(0,2);
		var cMonth = fulldate.substr(3,2);
		var askedMonth = dateId.substr(3,2);
		cMonth = parseInt(askedMonth);
		
		//TODO: Verificar direito o fucionamento disso com a pessagem dos meses.
		if(parseInt(cDay) < 11){
			cMonth = parseInt(askedMonth) - 1;
		} else {
			cMonth = parseInt(askedMonth);
		}
		//importAhgora(cMonth,cYear,cDay);
		ahgora.import(cMonth, cYear, cDay);
	};
	
	function getScreenMonth(){
		var cYear = $("#month-name").text();
		cYear = $.trim(cYear);
		cYear = cYear.replace(" ","").replace(" ","");
		var ini = parseInt(cYear.length);
		cYear = cYear.substring(ini - 4,ini);
		return cYear;
	}
	
	function updateLine(rowDate){
	
		/*
		var inicio = $("#"+rowDate+" .begin-day input").val();
		var almoco = $("#"+rowDate+" .start-lunch input").val();
		var retorno = $("#"+rowDate+" .end-lunch input").val();
		var saida = $("#"+rowDate+" .end-day input").val();
		var extra = $("#"+rowDate+" .vpn-cell input").val();
		var total = $("#"+rowDate+" .all-worked").text();
		var almoco = $("#"+rowDate+" .lunch").text();
		var bh = $("#"+rowDate+" .excedente").text();
		var excluir = $("#"+rowDate+" .delIcon").src();
		var faltaIcon = $("#"+rowDate+" .begin-day input").val();
		var ausente = $("#"+rowDate+" .begin-day input").val();
		*/
		
		$("#"+rowDate+" .begin-day input").val("");
		$("#"+rowDate+" .start-lunch input").val("");
		$("#"+rowDate+" .end-lunch input").val("");
		$("#"+rowDate+" .end-day input").val("");
		$("#"+rowDate+" .end-day input").attr("placeholder","");
		$("#"+rowDate+" .vpn-cell input").val("");
		$("#"+rowDate+" .all-worked").text("");
		$("#"+rowDate+" .lunch").text("");
		$("#"+rowDate+" .excedente").text("");
		//var excluir = $("#"+rowDate+" .delIcon").src();
		//var faltaIcon = $("#"+rowDate+" .begin-day input").val();
		//var ausente = $("#"+rowDate+" .begin-day input").val();
	
	}
	
	/**
	 * Remover um dia especÌfico
	 */
	window.removeDay = function(dateId){
		var cYear = getScreenMonth();
		var cDay = dateId.substr(0,2);
		var cMonth = dateId.substr(3,2);
		cMonth = parseInt(cMonth) - 1;
		if(parseInt(cMonth) < 10){
			cMonth = "0"+cMonth;
		}
		var ccDate = new Date(cYear, cMonth, cDay);
		var rowDate = ccDate.getTime();
		var dayExists = localStorage.getItem(rowDate);

		if(confirm("Deseja realmente excluir este dia?")){
			localStorage.removeItem(rowDate);
			updateLine(rowDate);
		}
		
	};
	
	/**
	 * Remover um dia especÌfico
	 */
	window.toogleAusent = function(dateId){
		var cYear = getScreenMonth();
		var cDay = dateId.substr(0,2);
		var cMonth = dateId.substr(3,2);
		cMonth = parseInt(cMonth) - 1;
		if(parseInt(cMonth) < 10){
			cMonth = "0"+cMonth;
		}
		var ccDate = new Date(cYear, cMonth, cDay);
		var rowDate = ccDate.getTime();
		var dayExists = localStorage.getItem(rowDate);
		var ausent = $("#"+rowDate+" .ausentLine input");
		var ausentImg = $("#"+rowDate+" .ausentImg");
		var isAusent = $("#"+rowDate+" .ausentLine input").attr("checked");
		
		//alert(isAusent);
		if(isAusent && isAusent.length > 0){
			ausent.removeAttr("checked");
			ausent.val("N");
			ausentImg.attr("src","res/img/ausent.png");
			ausentImg.attr("title","Presente no local de trabalho. Clique para sinalizar aus√™ncia neste dia.");
		} else {
			ausent.attr("checked","checked");
			ausent.val("S");
			ausentImg.attr("src","res/img/user2.png");
			ausentImg.attr("title","Ausente no local de trabalho. Clique para sinalizar presen√ßa neste dia.");
		}
		
		currentMonth.changeEvent2(rowDate);
		
		
		
		/*
		if(confirm("Deseja realmente excluir este dia?")){
			localStorage.removeItem(rowDate);
			updateLine(rowDate);
		}
		*/
		
	};
	
	
	
	function initAhgora(){
		
		//Busca e seta as configuraÁıes
		var set = dao.loadSettings();
		
		//1. Verifica se a importaÁ„o est· ativa
		if(set.permAhgora == 1){
			var matricula = set.matricula;
			var senha = set.senha;
			var empresa = set.empresa;
			
			if(empresa.length == 0){
				empresa = null;
			}
			
			if(senha.length == 0){
				senha = null;
			}
			
			if(matricula.length == 0){
				matricula = null;
			}
			
			if(matricula == null || senha == null || empresa == null){
				var msg = "Informe sua Matr√≠cula, Senha e Empresa nas Configura√ß√µes antes de realizar a importa√ß√£o.";
				$("#msg-lightbox-content").html(msg);
				closeLightbox("#perform-update");
				openLightbox("#msg-lightbox");
			} else {
				ahgora = new Ahgora(matricula,senha,empresa,helpers,dao,openLightbox,closeLightbox,buildMonth,initNotifTimer);
			}
		} else {
			ahgora = null;
		}
	}
	
	function initImport(){
		currentMonth = new hrs.ui.month(currentDate.getMonth(), currentDate.getFullYear());
		var cMonth = currentDate.getMonth();
		var cYear = currentDate.getFullYear();
		ahgora.import(cMonth, cYear, null);
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
				var mensagem = "Bom dia! VocÍ j· registrou seu ponto hoje?";
				notificationGeral(mensagem,"default");
			}
		} else 
		*/
		if(parseInt(cMin) == 59 && parseInt(cSec) == 0){
			//importAhgora(cMonth,cYear,thisDay);
			ahgora.import(cMonth,cYear,thisDay);
		}
		
		var t = setTimeout(function(){
	    	initGlobalTimers();
	    },500);
		
	}
	
	function initNotifTimer(){
		
		initGlobalTimers();
	
		var _dateHelpers = hrs.helpers.dateTime;
		//1. Busca a hora de saÌda estimada do dia atual
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
		$("#saidaAlmocoEstimada").html("12:00");//Mudar isso por um c·lculo depois, feito a partir das configuraÁıes.
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
			$("#saidaTimeLabel").html("Tempo atÈ saÌda: ");
			$("#proxSaidaExtimada").html("-");
			$("#proxSaidaTimer").html("-");
		}
		
		var wodLaunch = currDataInfo.expectedExit;
		var whSaida = 03;
		var wmSaida = 00;
		var wodDate = new Date(2014, 11, 13, whSaida, wmSaida, 0, 0);
		document.getElementById('alarm-sound-wod').play();
		document.getElementById('alarm-sound-wod').volume=0.3;
		
		if(entrada.length > 0){
			$("#proxSaidaTimer2").css("color","red");
			var dif = _dateHelpers.getTimeDiff(wodDate,curDate);
			var dif2Calc = dif.getTime();
			updateHoraWOD(wodDate,dif2Calc);
		} else {
			$("#proxSaidaTimer2").css("color","black");
			$("#proxSaidaTimer2").html("-");
			document.getElementById('alarm-sound-wod').pause();
		}
			
	}
	
	function notificationTeste(tempo){
		//notif.checkPermissionDirect();
		var browser = utils.checkbrowser();
		
		if(browser.name == "Chrome" || browser.name == "Firefox"){
			//checkPermission();
			
			var title = "Controle de Banco de Horas";
			var options = {
					  body: "Faltam "+tempo+" minuto(s) para sua sa√≠da. Fique atento!",
					  icon: "res/icon.png"
					};
			notif.create(title,options,null);
			
		} else {
			alert("Notifica√ß√µes n√£o implementadas para esta vers√£o do seu browser.");
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
			alert("Notifica√ß√µes n√£o implementadas para esta vers√£o do seu browser.");
		}
		
	}
	
	function updateHoraAlmoco(exitDate,dif2Calc){
		//notificationTeste();
		var curDate = new Date();
		var _dateHelpers = hrs.helpers.dateTime;
		
		
		if(dif2Calc > 0){
			$("#retornoAlmocoTimer").css("color","green");
			$("#retornoAlmocoTimerLabel").html("Tempo at√© retorno: ");
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
					var mensagem = "Faltam "+m+" minuto(s) para encerrar seu hor√°rio de almo√ßo! Fique atento.";
					notificationGeral(mensagem,"five");
				}
				break;
			case 0:
				if(s == 59){
					var mensagem = "Falta menos de um minuto minuto(s) para encerrar seu hor√°rio de almo√ßo!";
					notificationGeral(mensagem,"default");
				} else if(s == 00){
					var mensagem = "Seu hor√°rio de almo√ßo j√° encerrou! Voc√™ deve bater seu ponto imediatamente!!!";
					notificationGeral(mensagem,"default");
				}
				break;
			}
	    } else if (dif2Calc < 0 && parseInt(h) == 0){
		
			if(m > 0 && s == 00){
				var mensagem = "Seu hor√°rio de almo√ßo j√° encerrou! Voc√™ deve bater seu ponto imediatamente!!!";
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
	
	function updateHoraWOD(exitDate,dif2Calc){
		//notificationTeste();
		var curDate = new Date();
		var _dateHelpers = hrs.helpers.dateTime;
		
		
		if(dif2Calc > 0){
			$("#proxSaidaTimer2").css("color","red");
			var dif = _dateHelpers.getTimeDiff(exitDate,curDate);
			dif2Calc = dif.getTime();
		} else {
			$("#proxSaidaTimer2").css("color","green");
			var dif = _dateHelpers.getTimeDiff(curDate,exitDate);
		}
	    var difTime = dif.getTime();
		
	    var teste = new Date(difTime);
	    var h = dif.getHours();
	    var m = teste.getMinutes();
	    var s = teste.getSeconds();
	    
	    h = fomartPartTime(h);
	    m = fomartPartTime(m);
	    s = fomartPartTime(s);
	    	
	    var faltaParaSairShow = h+":"+m+":"+s;
	    $("#proxSaidaTimer2").html(faltaParaSairShow);

	    var t = setTimeout(function(){
	    	updateHoraWOD(exitDate,dif2Calc);
	    },500);
	}
	
	function updateHoraSaida(exitDate,dif2Calc){
		//notificationTeste();
		var curDate = new Date();
		var _dateHelpers = hrs.helpers.dateTime;
		
		
		if(dif2Calc > 0){
			$("#saidaTimeLabel").html("Tempo at√© sa√≠da: ");
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
					var mensagem = "Faltam "+m+" minuto(s) para sua sa√≠da. Fique atento!";
					notificationGeral(mensagem,"default");
				}
				break;
			case 20:
				if(s == 59){
					//notificationTeste(m);
					var mensagem = "Faltam "+m+" minuto(s) para sua sa√≠da. Fique atento!";
					notificationGeral(mensagem,"default");
				}
				break;
			case 10:
				if(s == 59){
					var mensagem = "Faltam "+m+" minuto(s) para sua sa√≠da. Fique atento!";
					notificationGeral(mensagem,"ten");
					//notificationTeste(m);
				}
				break;
			case 5:
				if(s == 59){
					if(m == 5){					
						var mensagem = "Faltam "+m+" minuto(s) para sua sa√≠da. Fique atento!";
						notificationGeral(mensagem,"five");
					} else {
						//notificationTeste(m);
						var mensagem = "Faltam "+m+" minuto(s) para sua sa√≠da. Fique atento!";
						notificationGeral(mensagem,"chimes");
					}
				}
				break;
			case 0:
				if(s == 59){
					var mensagem = "Falta menos de 1 minuto para sua sa√≠da. Fique atento!";
					notificationGeral(mensagem,"default");
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
		$("#control-since").val(settings.controlSince).change(saveSettings);
		$("#initial-balance").val(settings.initialBalance).change(saveSettings);
		
		if(settings.permAhgora == 1){
			$("#permAhgora").attr("checked","checked");
			$("#showAhgora").fadeIn();
			$(".btImportMonth").show();
			$(".upDayOn").show();
			$(".upDayOff").hide();
		} else {
			$("#permAhgora").removeAttr("checked");
			$("#showAhgora").fadeOut();
			$(".btImportMonth").hide();
			$(".upDayOn").hide();
			$(".upDayOff").show();
		}
		$("#permAhgora").change(saveSettings);
		
		if(settings.permNotif == 1){
			$("#permNotif").attr("checked","checked");
			$("#showNotif").fadeIn();
		} else {
			$("#permNotif").removeAttr("checked");
			$("#showNotif").fadeOut();
		}
		$("#permNotif").change(saveSettings);
		
//		if(settings.permOponto == 1){
//			$("#permOponto").attr("checked","checked");
//		} else {
//			$("#permOponto").removeAttr("checked");
//		}
//		$("#permOponto").change(saveSettings);
		
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
		
		var permAhgora = $("#permAhgora").is(":checked");
		permAhgora = (permAhgora)?1:0;
		
		var permNotif = $("#permNotif").is(":checked");
		permNotif = (permNotif)?1:0;
		
		//var permOponto = $("#permOponto").is(":checked");
		//permOponto = (permOponto)?1:0;
		
		var controlSince = $("#control-since").val();
		
		dao.saveSettings({
			'totalWork': $("#total-work").val(),
			'lunchTime': $("#lunch-time").val(),
			'controlSince' : controlSince,
			'initialBalance': $("#initial-balance").val(),
			'permAhgora': permAhgora,
			'permNotif': permNotif,
			//'permOponto': permOponto,
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
	$( "#control-since" ).datepicker({ dateFormat: 'dd/mm/yy' });
});