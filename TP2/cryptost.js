var token = '';

$(document).ready(function () {

    $('#api').show(500);
    $('#graf').hide();
    $('#api2').hide();

    $('#mostrarGraf').click(function () {
        $('#graf').show(500); 
        $('#api').hide();
        $('#api2').hide();
    });
    $('#mostrarApi').click(function () {
        $('#api').show(500); 
        $('#graf').hide();
        $('#api2').hide();
    });
    $('#mostrarApi2').click(function () {
        $('#api2').show(500);
        $('#graf').hide();
        $('#api').hide();
    });

    $.ajax({
        url: "https://gestionweb.frlp.utn.edu.ar/api/auth/local",
        method: "POST",
        data: {
            identifier: 'grupo4',
            password: 'Contraseñagrupo4'
        },
        success: function (response) {
            console.log(response);
            token = response.jwt;
            crypto(response);
            strapi(response);
            graficos(response);
        },
        error: function (req, status, err) {
        }
    });
});


//CRYPTO

function crypto() {
    var html = '<label for=""><h4>Agregue una Cryptomoneda y una Fecha para ver su precio: </h4></label> <br> <form id="crypto"> Criptomoneda (idAPI que se encuentra en Coingecko) : <input type="text" id="NomCrypto"> <br> Fecha de Precio de la Crypto (dd-mm-yyyy) : <input type="text" id="FechaCrypto"> <br> <button class="btnAzul" input type="submit" id="cargarDatos" onclick="listarCryptoPagina()"> Cargar Datos </button></form>'
    $("#crypto").html(html);
    const cryptos = document.querySelector('#crypto');
    cryptos.addEventListener('submit', event => {
        event.preventDefault();
        console.log('Envío del formulario');
    });
};


function listarCryptoPagina() {
    var NombreCrypto = $("#NomCrypto").val();
    var FechaCrypto = $("#FechaCrypto").val();
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/coins/' + NombreCrypto + '/history?date=' + FechaCrypto,
        method: "GET",
        dataType: "json",
        success: function (response) {
            cryptos = response;
            enviarDatosAStrapi(cryptos);
            console.log(response);
            alert("Cryptomoneda añadida a Strapi")
        },
        error: function (req, status, err) {
            alert("No se pudo añadir la cryptomoneda a Strapi")
            console.log(req, status, err);
        }
    });
}



//STRAPI

function strapi() {
    var html = '<button class="btnAzul" id="cryptosCargadas" onclick="verCargados()">Ver Cryptos cargadas en Strapi</button>';
    $("#strapi").html(html);
}

function cargarDatosDeStrapi() {
    $.ajax({
        url: "https://gestionweb.frlp.utn.edu.ar/api/cryptomonedas",
        method: "GET",
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`
        },

        success: function (response) {
            console.log(response)
        },
        error: function (req, status, err) {
            console.log(err);
        }

    });
}

function verCargados() {
    var html = '<label for="">Cryptomonedas cargadas en Strapi:</label> <br> <button class="btnAzul" onclick="verDatos()">Ver Datos</button> <br>  <table id="respuesta"><thead><th>Crypto</th><th>Precio</th><th>Fecha</th></thead><tbody id="respuesta_body"></tbody></table> <button class="btnAzul" id="btnElim" onclick="eliminarCrypto()" >Borrar</button></fieldset> <br><br> <button class="btnAzul" onclick="strapi()">Volver</button>';
    cargarDatosDeStrapi();
    $("#strapi").html(html);
}


function verDatos() {

    $.ajax({
        url: "https://gestionweb.frlp.utn.edu.ar/api/cryptomonedas",
        method: "GET",
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: function (response) {
            cryptosStrapi = response.data;
            for (i in cryptosStrapi) {
                let tr = '<tr>' +
                    '<td>' + cryptosStrapi[i].attributes.nombreCrypto + '</td>' +
                    '<td>' + cryptosStrapi[i].attributes.precioActual + '</td>' +
                    '<td>' + cryptosStrapi[i].attributes.fechaCrypto + '</td>' +
                    '</tr>'
                console.log(tr)
                $('#respuesta_body').append(tr)
            }
        }
    });
}

function enviarDatosAStrapi(cryptos) {

    let arrayDeCryptos = [];
    NombreCrypto = $("#NomCrypto").val();
    FechaCrypto = $("#FechaCrypto").val();

    arrayDeCryptos.push(
        {
            nombreCrypto: NombreCrypto,
            precioActual: cryptos.market_data.current_price.usd,
            fechaCrypto: FechaCrypto,
        }
    );

    arrayDeCryptos.forEach(crypto => {

        $.ajax({
            url: "https://gestionweb.frlp.utn.edu.ar/api/cryptomonedas",
            method: "POST",
            dataType: "json",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                data: JSON.parse(JSON.stringify(crypto)),
            },
            success: function (response) {
                console.log(response);
            },
            error: function (req, status, err) {

                console.log(err);
            }
        });
    });
};


function eliminarCrypto() {
    var html = '<form id= "cryptoelim"> Ingrese cryptomoneda a eliminar (ultima que esta en strapi con ese id) : <input type="text" id="campoElim"> <br><br> <button class="btnAzul" input type="submit" id="eliminarDatos" onclick="deleteStrapi()">Eliminar</button></input> <button class="btnAzul" onclick="verCargados()">Volver</button></form>'
    $("#strapi").html(html);
    const cryptoselim = document.querySelector('#cryptoelim');
    cryptoselim.addEventListener('submit', event => {
        event.preventDefault();
        console.log('Envío del formulario');
    });
};

function deleteStrapi() {
    var nom = $("#campoElim").val();
    $.ajax({
        url: "https://gestionweb.frlp.utn.edu.ar/api/cryptomonedas",
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
        dataType: "json",
        success: function (response) {
            cryptosStrapi = response.data;
            for (i in cryptosStrapi) {
                if (cryptosStrapi[i].attributes.nombreCrypto == nom) {
                    var id = cryptosStrapi[i].id;
                }
            }

            deleteCrypto(id);

        },
        error: function (req, status, err) {
            console.log(req, status, err);
        }
    });
}

function deleteCrypto(id) {
    $.ajax({
        url: "https://gestionweb.frlp.utn.edu.ar/api/cryptomonedas/" + id,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        },
        dataType: "json",
        success: function (response) {
            alert("Crypto borrada: " + id);
            verCargados();
        },
        error: function (req, status, err) {
            alert("Cryptomoneda no encontrada")
            console.log(req, status, err);
        }
    });
}


//GRAFICOS

function graficos() {
    google.charts.load('current', { 'packages': ['bar', 'corechart'] });
    var html = '<div class="divBotonesGrafico"><div class="botonStrapitodos"><button id="grafBTC" class="btnAzul" onclick="graficoBTCLunes()">Grafico precio del Bitcoin los lunes de junio de 2022</button></div><br> <div class="divBotonesGrafico"><button id="grafLuna" class="btnAzul" onclick="graficoLuna()">Grafico precio de Luna previo al colapso</button> <div id="dibujarGraficos"><br><br><button id="dibujarGrafico" class="btnAzul" onclick="graficoUST()">Grafico de UST previo al colapso</button></div>';
    $("#graficos").html(html);
}

function graficoBTCLunes() {
    google.charts.setOnLoadCallback(dibujar);
    $.ajax({
        url: "https://gestionweb.frlp.utn.edu.ar/api/cryptomonedas",
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
        dataType: "json",
        success: function (response) {
            cryptosStrapi = response.data;
            var arrayData = [['Fecha', 'Precio']];
            for (i in cryptosStrapi) {
                if (cryptosStrapi[i].attributes.nombreCrypto.includes('bitcoin')) {
                    arrayData.push([cryptosStrapi[i].attributes.fechaCrypto, cryptosStrapi[i].attributes.precioActual]);
                }
            }
            data = google.visualization.arrayToDataTable(arrayData);
            var options = {
                title: 'Precio del Bitcoin los dias lunes del mes de junio de 2022',
                hAxis: { title: 'Fecha' },
                vAxis: { title: 'Precio' },
                legend: 'none'
            };
            dibujar(data, options);
        },
        error: function (req, status, err) {
            console.log(req, status, err);
        }
    });
}

function graficoLuna() {
    google.charts.setOnLoadCallback(dibujarArea);
    $.ajax({
        url: "https://gestionweb.frlp.utn.edu.ar/api/cryptomonedas",
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
        dataType: "json",
        success: function (response) {

            cryptosStrapi = response.data;
            var arrayData = [['Fecha', 'Precio']];
            for (i in cryptosStrapi) {
                if (cryptosStrapi[i].attributes.nombreCrypto.includes('luna-wormhole')) {
                    arrayData.push([cryptosStrapi[i].attributes.fechaCrypto, cryptosStrapi[i].attributes.precioActual]);
                }
            }
            //}

            data = google.visualization.arrayToDataTable(arrayData);
            var options = {
                title: 'Grafico del precio de Luna previo al colapso',
                hAxis: { title: 'Fecha' },
                vAxis: { title: 'Precio' },
                legend: 'none'

            }
                dibujarArea(data, options);
        },
        error: function (req, status, err) {
            console.log(req, status, err);
        }
    });
}

function graficoUST() {
    google.charts.setOnLoadCallback(dibujarArea);
    $.ajax({
        url: "https://gestionweb.frlp.utn.edu.ar/api/cryptomonedas",
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
        dataType: "json",
        success: function (response) {

            cryptosStrapi = response.data;
            var arrayData = [['Fecha', 'Precio']];
            for (i in cryptosStrapi) {
                if (cryptosStrapi[i].attributes.nombreCrypto.includes('terrausd')) {
                    arrayData.push([cryptosStrapi[i].attributes.fechaCrypto, cryptosStrapi[i].attributes.precioActual]);
                }
            }
            //}

            data = google.visualization.arrayToDataTable(arrayData);
            var options = {
                title: 'Grafico del precio de UST previo al colapso',
                hAxis: { title: 'Fecha' },
                vAxis: { title: 'Precio' },
                legend: 'none'

            }
                dibujarLinea(data, options);
        },
        error: function (req, status, err) {
            console.log(req, status, err);
        }
    });
}

function error() {
    alert("No ha seleccionado ningun grafico");
}



function dibujar(data, options) {
    google.charts.load('current', { 'packages': ['bar'] });

    var html = '<div id="graficosChart"> <br><br> </div><button class="btnAzul" onclick="graficos()">Volver</button> '
    $("#graficos").html(html);

    var chart = new google.charts.Bar($("#graficosChart")[0]);

    chart.draw(data, google.charts.Bar.convertOptions(options));

}


function dibujarArea(data, options) {
    google.charts.load('current', { 'packages': ['corechart'] });

    var html = '<div id="graficosChart"></div> <br><br>  <button class="btnAzul" onclick="graficos()">Volver</button>'
    $("#graficos").html(html)

    var chart = new google.visualization.AreaChart($("#graficosChart")[0]);

    chart.draw(data, options);

}

function dibujarLinea(data, options) {
    google.charts.load('current', { 'packages': ['corechart'] });

    var html = '<div id="graficosChart"></div> <br><br>  <button class="btnAzul" onclick="graficos()">Volver</button>'
    $("#graficos").html(html)

    var chart = new google.visualization.LineChart($("#graficosChart")[0]);

    chart.draw(data, options);

}