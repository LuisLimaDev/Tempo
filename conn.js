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
			err: "erro: '" + pg.status + "'"
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