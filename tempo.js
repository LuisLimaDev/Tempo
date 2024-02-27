
// tempo.js

// nomeDacidade > pesquisa > códigoCidade;

// códigoCidade > previsao;
// nomeDoElemento, atributoID, atributoName, atributoValue, atributoType, atributoClass, atributoHREF, atributoSRC, atributoTarget, atributoOnClick, atributoStyle, conteudoInterno
//
//
// ICONES
// &#9728; SOL
// &#9729; NUVEM
// &#9730; GUARDA-CHUVA
// &#9731; NEVE/MUITO FRIO
// &#9788; ICONE DE DIA
// &#9789; ICONE DE NOITE
// 

tentCarr = 0;

caixaDePesquisa = ll2.novo({
	nomeDoElemento: "fieldset",
	conteudoInterno: ll2.novo({
		nomeDoElemento: "label",
		conteudoInterno: "<span id='cidadeEscolhida'>Nome da cidade</span>"
		+ ll2.novo({
			nomeDoElemento: "input",
			atributoID: "entradaNome",
			outros: [{att: "onkeyup", valor: "pesqCidade()"}]
		}).outerHTML
	}).outerHTML
	+ ll2.novo({
		nomeDoElemento: "label",
		conteudoInterno: "Resultados da pesquisa: " + ll2.novo({
			nomeDoElemento: "select",
			atributoID: "segsCidades",
			outros: [{att: "onchange", valor: "salvarEscolha( this )"}]
		}).outerHTML
	}).outerHTML
	+ ll2.novo({
		nomeDoElemento: "button",
		atributoOnClick: "exibirPrevisao()",
		conteudoInterno: "Cidade escolhida"
	}).outerHTML
});

painel = ll2.novo({
	nomeDoElemento:"div",
	atributoID: "llTempo",
	atributoClass: "llTempo",
	conteudoInterno: ll2.novo({
		nomeDoElemento: "div",
		atributoClass: "",
		conteudoInterno: ""
	}).outerHTML
});

inicioPrevTempo=( elSaida )=>{
	elSaida.innerHTML = "";
	elSaida.append( painel );
	setTimeout(function(){
		exibirPrevisao();
	},300);
}

/******************************************************/
/******************************************************/
/******************************************************/

pesqCidade=()=>{
	getById("segsCidades").innerHTML = "";
	nomePraPesquisa = getById("entradaNome");
	// ll2.set( getById("entradaNome"), [{att:"list",valor:"segsCidades"}]);
	resPesq = "";
	if( !(nomePraPesquisa.value.match(" - ")) == true && nomePraPesquisa.value != "" && nomePraPesquisa.value.length > 3 ){
		req({
			obj: "https://brasilapi.com.br/api/cptec/v1/cidade/" + nomePraPesquisa.value.replaceAll(" ","%20"),
			callback: (res)=>{
				resPesq = res;
				resPesq = eval( resPesq );
			}
		});
		// if( resPesq.length != 0 ){
			setTimeout( function(){
				for( i=0; i < resPesq.length; i++ ){
					getById("segsCidades").innerHTML = "<option value='" + resPesq[i].id + "' data-objetos='" + JSON.stringify( resPesq[i] ) + "'>" + resPesq[i].nome + " - " + resPesq[i].estado + "</option>" + getById("segsCidades").innerHTML
				}
			}, 200)
		// }
	}
}

salvarEscolha=( seletor )=>{
	getById("cidadeEscolhida").innerText = "" + seletor.options[ seletor.selectedIndex ].innerText;
	infoCidade = segsCidades.options[ segsCidades.selectedIndex ].dataset.objetos;
	localStorage.setItem("llTempoClima", infoCidade );
	
}

inserGradPrev=(objServ)=>{
	
			
	prevSemana = ll2.novo({
		nomeDoElemento: "div",
		atributoClass: "view",
		conteudoInterno: "<div class='infoCidade'><div class='left'>"+
		ll2.novo({
			nomeDoElemento: "h2",
			atributoClass: "nomeCidade",
			conteudoInterno: fundo()[1] + "<br>" + objServ.cidade + " - " + objServ.estado
		}).outerHTML
		+ ll2.novo({
			nomeDoElemento: "h3",
			atributoClass: "atualizadoEm",
			conteudoInterno: llt.dataPorExtenso2( objServ.atualizado_em )
		}).outerHTML
		+"</div><div class='rigth'><input type='checkbox' name='alteraCity' id='alteraCity' style='display: none'><label for='alteraCity'><span>Alterar cidade</span><div class='onOff'><div class='chave'></div></div></label>"
		+ caixaDePesquisa.outerHTML +"</div></div>"
	});
	gradeDias = ll2.novo({
		nomeDoElemento: "div",
		atributoClass: "gradeDias"
	})
	for(i=0; i<objServ.clima.length; i++){
		gradeDias.append( ll2.novo({
			nomeDoElemento: "div",
			atributoClass: "quadroDia dia" + i + " " + objServ.clima[i].condicao,
			conteudoInterno: "<div class='condicao'></div><div class='condicao_desc'>Condição climática "+ objServ.clima[i].condicao_desc +"</div><div class='dataDia'>"+ llt.dataPorExtenso2( objServ.clima[i].data ) +"</div><div class='indiceUV'>Radiação UV: "+ objServ.clima[i].indice_uv +"</div><div class='temperatura'><div class='min'>Mínima: "+ objServ.clima[i].min +"°C</div><div class='max'>Máxima: "+ objServ.clima[i].max +"°C</div></div>"
		}) )
	}
	prevSemana.append( gradeDias )
	painel.append( prevSemana )
}

exibirPrevisao=()=>{
	llt = new llTempo;
	prevs = "";
	if( localStorage.getItem("llTempoClima") == null ){
		req({
			obj: "https://brasilapi.com.br/api/cptec/v1/clima/previsao/1182/6",
			callback: (res)=>{ prevs = res }
		});
	} else {
		infoCidade = JSON.parse( localStorage.getItem("llTempoClima") );
		req({
			obj: "https://brasilapi.com.br/api/cptec/v1/clima/previsao/" + infoCidade.id + "/6",
			callback: (res)=>{ prevs = res }
		});
	}
	prevs = eval("[" + prevs + "]");
	setTimeout(()=>{
		if( prevs.cidade != undefined ){
			inserGradPrev( prevs );
		} else if( prevs.cidade == undefined ){
			prevs = JSON.parse("["+ prevs + "]");
			tentCarr++
			if( tentCarr > 3 && prevs.cidade == undefined ){
				exibirPrevisao();
			} else if( tentCarr == 3 ){
				painel.innerHTML = "";
				painel.append( ll2.novo({
					nomeDoElemento: "h3",
					conteudoInterno: "Não foi possivel exibir. <a href='javascript:exibirPrevisao()'>Tente novamente</a>"
				}) );
			}
			inserGradPrev( prevs[0] )
		}
	}, 200);
}

fundo=()=>{
	if( llt.tagHoraAtualizada() < 120000000 ){
		per = ["manhã", "Bom dia", "radial-gradient(150px 150px, #fff 50px, #ffa 50px 70px, #adf  100px)"]
	} else if( llt.tagHoraAtualizada() > 120000000 && llt.tagHoraAtualizada() < 180000000 ){
		per = ["tarde", "Bom tarde", "radial-gradient(150px 150px, #fff 50px, #ffa 50px 70px, #adf4  100px), linear-gradient(45deg, #048, transparent)"]
		// per = ["tarde", "Bom tarde", `url( 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="drawe" height="120" width="120"><text class="item0" font-size="80px" transform="translate(15, 75)" style="fill: stroke: rgb(255 255 255)">🌚</text></svg>' )`]
	} else if( llt.tagHoraAtualizada() < 50000000 || llt.tagHoraAtualizada() > 180000000 ){
		per = ["noite", "Boa noite", "linear-gradient(45deg, #024, transparent)"]
	}
	// getById("llTempo").style.backgroundImage = per[2]
	return per
}