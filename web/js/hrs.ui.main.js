hrs=window.hrs||{};hrs.ui=window.hrs.ui||{};utils=new Utils;hrs.ui.main=function(e,t,n){function f(){s=new hrs.ui.month(i.getMonth(),i.getFullYear());var e=i.getMonth();var t=i.getFullYear();l(e,t,null)}function l(t,r,s){N("#perform-update");var o=i.getDate();if(o>11){t=parseInt(t)+1}t="0"+t;var u="http://khi.by/projetos/pontoconn/";var a=hrs.helpers,f=hrs.helpers.dateTime;var l=n.loadSettings();var c=l.matricula;var h=l.senha;var p=l.empresa;if(s==null){s=0}if(c==null||h==null||p==null){var d="Informe sua Matr�cula, Senha e Empresa nas Configura��es antes de realizar a importa��o.";e("#msg-lightbox-content").html(d);k("#perform-update");N("#msg-lightbox")}else{u+="?m="+c+"&s="+h+"&e="+p+"&mes="+t+"&ano="+r+"&day="+s+"&type=json&di=0";console.log(u);e.get(u,function(e,t,r){if(r.status!=200){k("#perform-update");N("#error-update")}else if(e){var i;var o;for(var u=0;u<=e.length;u++){i=e[u];for(var a in i){var l=i[a].batidas.texto;if(l.length>0){var c=i[a].data;var h=c.substr(0,2);var p=c.substr(3,2);var d=c.substr(6,4);if(h<10){h=h.substr(1,1)}if(p<10){p=p.substr(1,1)}p=parseInt(p)-1;var v=new Date(d,p,h);var m=new Date;var g=m.getMonth();var y=m.getFullYear();var b=m.getDate();var w=new Date(y,g,b);s=parseInt(s);h=parseInt(h);if(s==0||s==h){var E=i[a].batidas.registros;var S=v.getTime();var x=localStorage.getItem(S);if(x==null||s==h){var T={entrada:!E[0]?0:f.parseDateTime(E[0],v),ida_almoco:!E[1]?0:f.parseDateTime(E[1],v),volta_almoco:!E[2]?0:f.parseDateTime(E[2],v),saida:!E[3]?0:f.parseDateTime(E[3],v),vpn:0,obs:"Batidas originais: "+l,ausent:false};n.storeDate(v,T)}}}}}}else{k("#perform-update");N("#error-update")}k("#perform-update")},"json").fail(function(){k("#perform-update");N("#error-update")}).done(function(){E();v()})}}function c(){alert("Clicou na parada e tal...")}function h(){o=new DesktopNotifications}function p(){}function d(){var e=new Date;var t=e.getFullYear();var n=e.getDay();var r=e.getMonth();var i=new Date(t,r,n);var o=s.getRowInfo(i);var u=o.entrada;var a=e.getHours();var f=e.getMinutes();var c=e.getSeconds();if(!u||u==""){var h=parseInt(f)%1==0;var p=parseInt(c)==59;if(parseInt(a)>7&&h&&p){}}else if(f==59&&c==0){l(r,t,n)}var v=setTimeout(function(){d()},500)}function v(){d();var t=hrs.helpers.dateTime;var n=new Date;var r=n.getMonth();var i=n.getFullYear();var o=n.getDate();var u=new Date(i,r,o);var a=s.getRowInfo(u);var f=a.expectedExit;var l=f.substring(0,2);var c=f.substring(3,5);var h=new Date(i,r,o,l,c,0,0);var p=a.almoco;var v=a.ida_almoco;var m=a.volta_almoco;var g=a.volta_almoco_estimada;var w=a.volta_almoco_estimada_time;var t=hrs.helpers.dateTime;e("#saidaAlmocoEstimada").html("12:00");var E;if(v.length>0){E=v}else{E="-"}e("#saidaAlmocoReal").html(E);var S;if(g.length>0){S=g}else{S="-"}e("#retornoAlmoco").html(S);e("#retornoAlmocoReal").html("-");if((m==null||m=="undefined"||m=="")&&v.length>0){var x=new Date(w.getYear(),w.getMonth(),w.getDay(),w.getHours(),w.getMinutes(),0,0);e("#retornoAlmoco").html(S);e("#retornoAlmocoTimer").css("color","green");e("#retornoAlmocoReal").html("-");var T=t.getTimeDiff(w,n);var N=T.getTime();y(w,N)}else{e("#retornoAlmocoTimer").css("color","black");e("#retornoAlmocoReal").html(m);e("#retornoAlmocoTimer").html("-");e("#retornoAlmoco").html("-")}var C=a.saida;var k=a.entrada;if((C==null||C=="undefined"||C=="")&&k.length>0){e("#proxSaidaExtimada").html(f);e("#proxSaidaTimer").css("color","red");var L=t.getTimeDiff(h,n);var A=L.getTime();b(h,A)}else{e("#proxSaidaTimer").css("color","black");e("#saidaTimeLabel").html("Tempo at� sa�da: ");e("#proxSaidaExtimada").html("-");e("#proxSaidaTimer").html("-")}}function m(e){var t=utils.checkbrowser();if(t.name=="Chrome"||t.name=="Firefox"){var n="Controle de Banco de Horas";var r={body:"Faltam "+e+" minuto(s) para sua sa�da. Fique atento!",icon:"res/icon.png"};o.create(n,r,null)}else{alert("Notifica��es n�o implementadas para esta vers�o do seu browser.")}}function g(e){var t=utils.checkbrowser();if(t.name=="Chrome"||t.name=="Firefox"){var n="Controle de Banco de Horas";var r={body:e,icon:"res/icon.png"};o.create(n,r,null)}else{alert("Notifica��es n�o implementadas para esta vers�o do seu browser.")}}function y(t,n){var r=new Date;var i=hrs.helpers.dateTime;if(n>0){e("#retornoAlmocoTimer").css("color","green");e("#retornoAlmocoTimerLabel").html("Tempo at� retorno: ");var s=i.getTimeDiff(t,r);n=s.getTime()}else{e("#retornoAlmocoTimer").css("color","red");e("#retornoAlmocoTimerLabel").html("Tempo de atraso: ");var s=i.getTimeDiff(r,t)}var o=s.getTime();var u=new Date(o);var a=s.getHours();var f=u.getMinutes();var l=u.getSeconds();if(n>0&&parseInt(a)==0){switch(f){case 5:if(l==59){var c="Faltam "+f+" minuto(s) para encerrar seu hor�rio de almo�o! Fique atento.";g(c)}break;case 0:if(l==59){var c="Falta menos de um minuto minuto(s) para encerrar seu hor�rio de almo�o!";g(c)}else if(l==0){var c="Seu hor�rio de almo�o j� encerrou! Voc� deve bater seu ponto imediatamente!!!";g(c)}break}}else if(n<0&&parseInt(a)==0){if(f>0&&l==0){var c="Seu hor�rio de almo�o j� encerrou! Voc� deve bater seu ponto imediatamente!!!";g(c)}}a=w(a);f=w(f);l=w(l);var h=a+":"+f+":"+l;e("#retornoAlmocoTimer").html(h);var p=setTimeout(function(){y(t,n)},500)}function b(t,n){var r=new Date;var i=hrs.helpers.dateTime;if(n>0){e("#saidaTimeLabel").html("Tempo at� sa�da: ");e("#proxSaidaTimer").css("color","red");var s=i.getTimeDiff(t,r);n=s.getTime()}else{e("#saidaTimeLabel").html("Hora extra: ");e("#proxSaidaTimer").css("color","green");var s=i.getTimeDiff(r,t)}var o=s.getTime();var u=new Date(o);var a=s.getHours();var f=u.getMinutes();var l=u.getSeconds();if(n>0&&parseInt(a)==0){switch(f){case 10:if(l==59){m(f)}break;case 20:if(l==59){m(f)}break;case 10:if(l==59){m(f)}break;case 5||4||3||2||1:if(l==59){m(f)}break;case 0:if(l==59){m(f)}break}}a=w(a);f=w(f);l=w(l);var c=a+":"+f+":"+l;e("#proxSaidaTimer").html(c);var h=setTimeout(function(){b(t,n)},500)}function w(e){if(e<10){e="0"+e}return e}function E(){s=new hrs.ui.month(i.getMonth(),i.getFullYear());s.setDao(n);s.setUpdatedRowCallback(S);s.print(u);e("#main-table tr").each(function(){var t=e(this);x(t.find(".total, .excedente"),t.find(".excedente").html())});S()}function S(r,s){var o=n.calculateTotals(i.getMonth(),i.getFullYear());e("#extra").html(o.extra.toString());e("#extra-month").html(o.extraMonth.toString());e("#month-name").html(t.dateTime.formatDate(i,"#MM / #yyyy"));var u=t.dateTime.formatDate(i,"#MM / #yyyy");var a="Importar "+u+" (Sistema Ahgora)";e("#importMonth").attr("value",a);x(e("#extra"),o.extra.toString());x(e("#extra-month"),o.extraMonth.toString());if(s!=undefined){x(r.find(".total, .excedente"),s.excedente)}e("#entrance-avg").html(t.dateTime.formatDate(o.avgEntrance,"#hh#m"));e("#exit-avg").html(t.dateTime.formatDate(o.avgExit,"#hh#m"));if(o.totalExtraDays>=0){e("#positive-days").show().find("#days-off").html(o.totalExtraDays);e("#negative-days").hide()}else{e("#negative-days").show().find("#days-to-pay").html(o.totalExtraDays);e("#positive-days").hide()}e("#ausent-days").html(o.ausentDays)}function x(e,t){var n=typeof t=="string"?t.indexOf("-")>-1:t<0;var r=n?"addClass":"removeClass";e[r]("negative-hours")}function T(){var t=n.loadSettings();e("#total-work").val(t.totalWork).change(L);e("#lunch-time").val(t.lunchTime).change(L);e("#initial-balance").val(t.initialBalance).change(L);e("#matricula").val(t.matricula).change(L);e("#senha").val(t.senha).change(L);e("#empresa").val(t.empresa).change(L);var r=e("div.utilDays input:checkbox");for(var i=0;i<t.utilDays.length;i++){r.filter("[value="+t.utilDays[i]+"]").attr("checked","checked")}r.change(L)}function N(t){var n=e(t);n.fadeIn().css("z-index",a++);var r=(e(window).width()-n.width())/2,i=(e(window).height()-n.height())/2;n.css({top:i+"px",left:r+"px"})}function C(){e(".open-lightbox").click(function(t){t.preventDefault();N(e(this).attr("href"))});e(".lightbox .close").click(function(t){e(this).closest(".lightbox").fadeOut().css("z-index","auto")})}function k(t){e(t).closest(".lightbox").fadeOut().css("z-index","auto")}function L(t,r){var i=[];e("input.utilDay:checked").each(function(){i.push(this.value)});n.saveSettings({totalWork:e("#total-work").val(),lunchTime:e("#lunch-time").val(),initialBalance:e("#initial-balance").val(),matricula:e("#matricula").val(),senha:e("#senha").val(),empresa:e("#empresa").val(),holidays:r||hrs.ui.holidays.getHolidays(),utilDays:i});E()}function A(){e("#prev-month").click(function(){i.setMonth(i.getMonth()-1);E()});e("#next-month").click(function(){i.setMonth(i.getMonth()+1);E()})}function O(e){var t=new FileReader;t.onload=function(e){var t=e.target.result;n.importData(t);E()};t.readAsText(e,"UTF-8");setTimeout(function(){location.reload()},500)}function M(){e("#link-export").click(function(){e("#output-export").val(n.exportData())[0].select()});e("#output-export").click(function(){this.select()});e("#import-data").click(function(t){e("#inputfile-import-data").click()});e("#proced-import").click(function(){O(e("#confirm-import")[0].file)});e("#inputfile-import-data").change(function(t){var n=t.target.files;if(n.length==0)return;e("#confirm-import")[0].file=n[0];e("#inputfile-import-data").val("");N("#confirm-import")})}function _(){hrs.ui.holidays.init({$elem:e("#holidays-list"),holidays:n.getHolidays(),callback:function(e){L(null,e)}})}function D(){e("a.export-pdf").click(function(e){e.preventDefault();window.print()})}var r={};var i=null,s=null,o=null,u=null,a=3;r.init=function(t){u=t;i=new Date;E();T();C();A();M();_();h();D();v();e("#importMonth").click(function(){f()});e("#current-month").click(function(){var e=new Date;i.setMonth(e.getMonth());E()})};window.updateDay=function(e){var t=i.getFullYear();var n=e+"/"+t;var r=n.substr(0,2);var s=n.substr(3,2);var o=e.substr(3,2);s=parseInt(o);if(parseInt(r)<11){s=parseInt(o)-1}l(s,t,r)};return r}(jQuery,hrs.helpers,hrs.dao);$(function(){hrs.ui.main.init($("#main-table"))})