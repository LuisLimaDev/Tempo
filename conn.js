// conn.js

var pg;

function req({
    obj,
    met,
    pd,
    callback
}) {
    obj = obj ? obj : "./";
    met = met ? met : "GET";
    pd = pd ? pd : "";
    callback = callback ? callback : "Sem 'callback' atribuido! ";
	pg = new XMLHttpRequest();
	pg.onerror = function () {
		callback({
			err: "Erro: " + pg.status
		})
	};
	pg.onload = function(){
		if (pg.status == 200) {
			callback(pg.response);
		} else {
			callback("Erro: " + pg.status)
		}
	};
	if (met != "POST") {
		pg.open(met, obj);
		pg.send()
	} else {
		pg.open(met, obj, true);
		pg.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		pg.send(pd)
	}

}

llURL = {
	req:({
		obj,
		met,
		pd,
		callback
	}) => {
		obj = obj ? obj : "./";
		met = met ? met : "GET";
		pd = pd ? pd : "";
		callback = callback ? callback : "Sem 'callback' atribuido! ";
		pg = new XMLHttpRequest();
		pg.onerror = function () {
			callback({
				err: "Erro: " + pg.status
			})
		};
		pg.onload = function(){
			if (pg.status == 200) {
				callback(pg.response);
			} else {
				callback("Erro: " + pg.status)
			}
		};
		if (met != "POST") {
			pg.open(met, obj);
			pg.send()
		} else {
			pg.open(met, obj, true);
			pg.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			pg.send(pd)
		}
	
	},
	encodeToURL: ( objContent )=>{
		chaves = Object.keys( objContent );
		valores = Object.values( objContent );
		objContent = new Array();
		for( nValores = 0; nValores < chaves.length; nValores++ ){
			objContent.push( chaves[nValores] + "=" + encodeURI(valores[ nValores] ) );
		}
		return objContent.join("&")
	},
	decodeURL: ( urlencoded )=>{
		paramsString = navigation.currentEntry.url.split("?")[1].split("&") || urlencoded.split("?")[1].split("&");
		urlencoded = new Array();
		if( paramsString.length > 0 ){
			for( params = 0; params < paramsString.length; params++ ){
				urlencoded.push({ key: paramsString[params].split( "=" )[0], val: paramsString[params].split( "=" )[1] });
			}
		}
		return urlencoded
	}
}
