hrs=window.hrs||{},hrs.dao=function(a,b){function c(){n=k.loadSettings()}function d(a){return""!=a&&void 0!=a?new Date(parseInt(a)):""}function e(a,c){var d=a.getTime(),e=new Date(d),f=new Date(d),g=12,h=g+n.lunchTime,i=60*(h-parseInt(h));e.setHours(g),f.setHours(h,i),c.ida_almoco=e,c.volta_almoco=f,c.almoco=b.dateTime.getTimeDiff(f,e)}function f(a){return n.utilDays.indexOf(a.getDay().toString())>-1}function g(a,b){return!f(a)||b?0:n.totalWork}function h(a){for(var b=0;b<n.holidays.length;b++){var c=n.holidays[b].date.split("/");if(a.getDate()==parseInt(c[0],10)&&a.getMonth()+1==parseInt(c[1],10))return n.holidays[b]}return null}function i(a,b,c){return a&&""!=a&&a.getMonth()==b&&a.getFullYear()==c}function j(a){return a.getMilliseconds()+1e3*a.getSeconds()+1e3*a.getMinutes()*60+1e3*a.getHours()*60*60}var k={},l="settings",m="a665612",n=null;return k.getDateInfo=function(c){"string"==typeof c&&(c=new Date(parseInt(c)));var f=a.evalJSON(localStorage.getItem(c.getTime()));return null==f?{entrada:"",saida:"",ida_almoco:"",volta_almoco:"",obs:"",holiday:h(c),vpn:"",ausent:!1}:(f.entrada=d(f.entrada),f.saida=d(f.saida),f.ida_almoco=d(f.ida_almoco),f.volta_almoco=d(f.volta_almoco),f.vpnExtra=parseInt(f.vpn),f.vpnExtra=isNaN(f.vpnExtra)?0:f.vpnExtra-c,f.vpn=d(f.vpn),f.holiday=h(c),f.almoco=""!=f.ida_almoco&&""!=f.volta_almoco?b.dateTime.getTimeDiff(f.volta_almoco,f.ida_almoco):new hrs.timeStamp(60*n.lunchTime*60*1e3),""!=f.entrada&&""!=f.saida?(""==f.ida_almoco&&""==f.volta_almoco&&e(c,f),f.total=b.dateTime.getTimeDiff(f.saida,f.entrada),f.total.addTimeStamp(f.vpnExtra),f.total.removeTimeStamp(f.almoco),f.extra=f.total.clone().addHours(-1*g(c,null!=f.holiday))):f.extra=f.total=""!=f.vpn?new hrs.timeStamp(f.vpnExtra):"",void 0==f.obs&&(f.obs=""),f)},k.storeDate=function(b,c){c.entrada=0==c.entrada?"":"undefined"!=typeof c.entrada?c.entrada.getTime():"",c.ida_almoco=0==c.ida_almoco?"":"undefined"!=typeof c.ida_almoco?c.ida_almoco.getTime():"",c.volta_almoco=0==c.volta_almoco?"":"undefined"!=typeof c.volta_almoco?c.volta_almoco.getTime():"",c.saida=0==c.saida?"":"undefined"!=typeof c.saida?c.saida.getTime():"",c.vpn=0==c.vpn?"":"undefined"!=typeof c.vpn?c.vpn.getTime():"",localStorage.setItem(b.getTime(),a.toJSON(c))},k.saveSettings=function(b){n=b,localStorage.setItem(l,a.toJSON(b)),n=k.loadSettings()},k.loadSettings=function(){var b=localStorage.getItem(l),c=["1","2","3","4","5"];return null==b||""==b?{totalWork:9,lunchTime:1,permAhgora:0,empresa:m,permNotif:0,holidays:[],initialBalance:0,utilDays:c}:(b=a.evalJSON(b),b.lunchTime=parseFloat(b.lunchTime),b.totalWork=parseFloat(b.totalWork),b.initialBalance=parseFloat(b.initialBalance),b.utilDays=b.utilDays||c,b)},k.getHolidays=function(){return n.holidays},k.calculateTotals=function(a,b){var c=0,d=0,e=0,f=0,h=0,l=0;n.initialBalance&&(c=60*n.initialBalance*60*1e3);var m=0;if(n.controlSince){var o=n.controlSince.substr(0,2),p=n.controlSince.substr(3,2),q=n.controlSince.substr(6,4),r=new Date(parseInt(q),parseInt(p)-1,parseInt(o));m=r.getTime()}for(var s in localStorage)if(!(isNaN(s)||m>0&&m>s)){var t=new Date(parseInt(s)),u=k.getDateInfo(s);if(u.ausent){var v=60*g(t,null!=u.holiday)*60*1e3;t.getMonth()==a&&t.getFullYear()==b&&(d-=v),c-=v,e++}else""!=u.total&&((i(u.entrada,a,b)||i(u.vpn,a,b))&&(d+=u.extra.getTime()),""!=u.entrada&&(f+=j(u.entrada)),""!=u.saida&&(h+=j(u.saida)),l++,c+=u.extra.getTime())}var w=new hrs.timeStamp(c),x=0==l?0:f/l,y=0==l?0:h/l;return{extra:w,extraMonth:new hrs.timeStamp(d),avgEntrance:new hrs.timeStamp(x),avgExit:new hrs.timeStamp(y),totalExtraDays:(w.getHours()/n.totalWork).toFixed(1),ausentDays:e}},k.exportData=function(){return a.toJSON(localStorage)},k.importData=function(b){"string"==typeof b&&(b=a.evalJSON(b));for(var c in b)localStorage[c]=b[c];k.loadSettings()},c(),k}(jQuery,hrs.helpers);