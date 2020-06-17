document.querySelector("img#referenceImage").addEventListener("contextmenu", function(event){
	event.preventDefault();
});

//função para ler o Json com os dados
		function fetchJSONFile(path) {
		    var httpRequest = new XMLHttpRequest();
		    httpRequest.open('GET', path);
		    httpRequest.send();

		    return httpRequest;
		}
		
		var ObjImage; //Objeto que recebe o conteúdo do json
		var player = JSON.parse('{"name":"", "points":0}'); //objeto com atributos do jogador
		var vetor; //vetor com string dos filenames das imagens
		var count=0; //contador das questões resppondidas
		var fetchs; //objeto com relação indice:descrição 
		var answers; //vetor com possíveis respostas
		var elementsSelected=0;
		var req = fetchJSONFile("images.json");
		req.onreadystatechange = function(){
			if (req.readyState==4 && req.status==200) {
				ObjImage = JSON.parse(req.response);
				vetor=ObjImage.images;
				fetchs=ObjImage.fetchs;
				answers = ObjImage.answers;
			}
		}

		//função para exibir o container das questões

		function showquestSet(){
			document.querySelector("div.questSet").classList.remove("hidden");
			document.querySelector("div.form").classList.add("hidden");
			changeQuestion();
		}

		var elementsDone = [];
		var RAns;

		//Função pra mudar a questão
		function changeQuestion() {
			var pos=0;
			if (vetor.length>elementsDone.length) {
				pos = Math.floor(Math.random()*vetor.length);
				var image = vetor[pos];
				while(elementsDone.indexOf(image)>-1) {
					pos=Math.floor(Math.random()*vetor.length);
					image = vetor[pos];
				}
					elementsDone.push(image);

					RAns = pos;

					document.querySelector("#referenceImage").src = "images/"+image;

			}
				document.querySelector("span#counter").innerHTML=(count+1)+"/15";
				document.querySelector("span#PlayerName").innerHTML=player.name;
				document.querySelector("span#PlayerPoints").innerHTML=player.points;
				var PosDone = [];
				var posit=0;
				[].forEach.call(document.querySelectorAll("div.answerElement"), function(answerElement){
					posit = Math.floor(Math.random()*answers.length);
					while(PosDone.indexOf(posit)>-1 || answers[posit].toUpperCase()==fetchs[RAns].toUpperCase()){ //repete a tribuição aleatória de forma que não repita nenhum item 
						posit = Math.floor(Math.random()*answers.length);
					}
					answerElement.innerHTML= answers[posit];
					answerElement.dataset.value = answers[posit];
					answerElement.dataset.index = posit;
					PosDone.push(posit);
					answerElement.classList.remove("activeElement");
					answerElement.classList.remove("wrongElel");
					answerElement.classList.remove("rightElel");
					elementsSelected=0;
				});

				var ind = Math.floor(Math.random()*document.querySelectorAll("div.answerElement").length);

				document.querySelectorAll("div.answerElement")[ind].innerHTML = fetchs[RAns];
				document.querySelectorAll("div.answerElement")[ind].dataset.value = fetchs[RAns];
				document.querySelectorAll("div.answerElement")[ind].dataset.index = RAns;
				count++;

		}

		document.querySelector("input[name='PlayerName']").addEventListener("focus", function(){
			document.querySelector("div.error").classList.add("hidden");
			document.querySelector("div.error").innerHTML="";
		});

		[].forEach.call(document.querySelectorAll("div.answerElement"), function(answerElement){
			answerElement.addEventListener("click", function(){
				if (document.querySelector("div.buttonNextAnswer").dataset.status==0 || document.querySelector("div.buttonNextAnswer").dataset.status==1) {
					if (elementsSelected==0) {
					this.classList.add("activeElement");
					elementsSelected++;
					}
				else{
					document.querySelector(".activeElement").classList.remove("activeElement");
					this.classList.add("activeElement");
				}
				}
				if (document.querySelector("div.buttonNextAnswer").dataset.status==0){
				document.querySelector("div.buttonNextAnswer").dataset.status++;
			}
			});
		});


		document.querySelector("form.formulario").addEventListener("submit", function(e){
			e.preventDefault();
			var namePlayerElement = document.querySelector("input[name='PlayerName']");

			var pattern = /^[A-Z](\D[^ ])*/g;
			if (namePlayerElement.value.length>=5 && pattern.test(namePlayerElement.value)) {
				player.name = namePlayerElement.value;
				showquestSet();
			}
			else{
				document.querySelector("div.error").classList.remove("hidden");
				document.querySelector("div.error").innerHTML="O nome do jogador deve conter pelo menos 5 dígitos, até 10 dígitos, não pode conter espaços e deve começar com uma letra maiúscula!";
			}
		});

		document.querySelector("div.buttonNextAnswer").addEventListener("click", function(){
				if (this.dataset.status==1) {
					var element = document.querySelector("div.activeElement");//seleciona o elemento ativo

					if (element.dataset.value == fetchs[RAns] && element.dataset.index == RAns) { //se o valor for o correto, 
						element.classList.add("rightElel");
						player.points++;
					}
					else{
						element.classList.add("wrongElel")
					}
						this.innerHTML = "Próximo";
						this.dataset.status++;
						document.querySelector("span#PlayerPoints").innerHTML=player.points;
				}
				else{
					if (this.dataset.status>1) {
						if (count<15) {
							changeQuestion();
							this.innerHTML = "Verificar";
							this.dataset.status=0;
						}
						else{
							document.querySelector(".container").innerHTML = "<div class='alert'>Teste concluído!<br><span class='Playernome'></span><br>Pontuação:<span class='PlayerScore'></span><br><a href='' class='backStart' >Refazer</a></div>";
							document.querySelector("span.Playernome").innerHTML=player.name;
							document.querySelector("span.PlayerScore").innerHTML=player.points + "/15";
						}
					}
				}
			});	