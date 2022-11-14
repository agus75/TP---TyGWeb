var array = new Array() 
array[0] = '<p id= "frase1"> Ronaldo Nazário: "Perdimos porque no ganamos" </p>';
array[1] = '<p id= "frase2">Franz Beckenbauer: "Sólo hay una posibilidad: victoria, derrota o empate" </p>';
array[2] = '<p id= "frase3">Míchel González: "Si llega a entrar el balón es gol."</p>';
var arrayLength = array.length;
var aleatoria = Math.round(Math.random() * (arrayLength - 1));
function mostrarFrase() {
    document.write(array[aleatoria]);
}