window.onload = puntajeInicial();

function puntajeInicial() {
	puntosUser = 0;
	puntosComputer = 0;
}

function user() {
	var options = document.getElementsByName('user');
	
	var selection = false;
	
	for (var i = 0; i < options.length; i++) {       
        if (options[i].checked) {
            userChoice = options[i].value;
            var selection = true;
            break;
        }
    }

    if (selection === false) {
    	document.getElementById("resultado").innerHTML = "Tenes que elegir una opcion para poder jugar";
    }

}

function computer() {
	var math = Math.random();

	if (math < 0.33) {
		computerChoice = "Piedra";
	} else if (math < 0.67) {
		computerChoice = "Papel";	
	} else {
		computerChoice = "Tijera";
	}
}

function versus() {
	if (userChoice === computerChoice) {
		resultado = "Empate";
	} else {
		switch (userChoice + " vs "+ computerChoice) {
			case "Piedra vs Papel":
				resultado = "Perdiste";
				puntosComputer = puntosComputer + 1;
				break;
			case "Piedra vs Tijera":
				resultado = "Ganaste";
				puntosUser = puntosUser + 1;
				break;
			case "Papel vs Piedra":
				resultado = "Ganaste";
				puntosUser = puntosUser + 1;
				break;
			case "Papel vs Tijera":
				resultado = "Perdiste";
				puntosComputer = puntosComputer + 1;
				break;
			case "Tijera vs Piedra":
				resultado = "Perdiste";
				puntosComputer = puntosComputer + 1;
				break;
			case "Tijera vs Papel":
				resultado = "Ganaste";
				puntosUser = puntosUser + 1;
				break;
		}
	}
}

function puntaje() {
	document.getElementById("resultado").innerHTML = "La computadora eligio: "+computerChoice+"<p>"+resultado+"</p>";
	document.getElementById("userScore").innerHTML = puntosUser;
	document.getElementById("computerScore").innerHTML = puntosComputer;
}

function game() {
	user();
	computer();
	versus();
	puntaje();
}