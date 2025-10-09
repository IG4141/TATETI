const express = require('express');
const app = express();
const PUERTO = 3000;

// Servidor principal para el juego de ta-te-ti con IA

// Determina que jugador es la IA basandose en la cantidad de fichas
function identificarJugador(tablero) {
    const fichasX = tablero.filter(valor => valor === 1).length;
    const fichasO = tablero.filter(valor => valor === 2).length;

    // Si hay igual cantidad, es turno de X (jugador 1)
    if (fichasX === fichasO) {
        return 1;
    } else if (fichasX > fichasO) {
        return 2; // Si hay mas X, es turno de O (jugador 2)
    } else {
        return 1; // Fallback por si acaso
    }
}

// Obtiene todas las posiciones vacias del tablero (valor 0)
function obtenerPosicionesVacias(tablero) {
    return tablero
        .map((valor, indice) => valor === 0 ? indice : null)
        .filter(indice => indice !== null);
}

// Funcion core que analiza una columna y determina la prioridad del movimiento
function analizarColumna(tablero, posiciones, jugadorIA) {
    const valores = posiciones.map(pos => tablero[pos]);
    const fichasIA = valores.filter(valor => valor === jugadorIA).length;
    const fichasOponente = valores.filter(valor => valor !== jugadorIA && valor !== 0).length;
    const casillerosVacios = valores.filter(valor => valor === 0).length;
    const posicionVacia = posiciones.find(pos => tablero[pos] === 0);

    // Prioridad 1: Victoria inminente (3 nuestras + 1 vacia)
    if (fichasIA === 3 && casillerosVacios === 1) {
        return { prioridad: 1, movimiento: posicionVacia };
    }
    // Prioridad 2: Bloquear al oponente (3 rivales + 1 vacia)
    else if (fichasOponente === 3 && casillerosVacios === 1) {
        return { prioridad: 2, movimiento: posicionVacia };
    }
    // Prioridad 3: Posibilidad de victoria (2 nuestra + 2 vacias)
    else if (fichasIA === 2 && casillerosVacios === 2) {
        return { prioridad: 3, movimiento: posicionVacia };
    }
    // Prioridad 4: Bloquear al oponente
    else if (fichasOponente === 2 && casillerosVacios === 2) {
        return { prioridad: 4, movimiento: posicionVacia };
    }
    // Prioridad 5: Posibiliad de victoria (1 nuestra + 3 vacias)
    else if (fichasIA === 1 && casillerosVacios === 3) {
        return { prioridad: 5, movimiento: posicionVacia };
    }
    // Prioridad 6: Bloquear al rival (1 rival + 3 vacias)
    else if (fichasOponente === 1 && casillerosVacios === 3) {
        return { prioridad: 6, movimiento: posicionVacia }
    }
    // Prioridad 7: Empate (totalmente vacia, ocupada por ambos)
    else {
        return { prioridad: 7, movimiento: posicionVacia };
    }
}



// Verifica si es el primer movimiento del juego (maximo 1 ficha en el tablero)
function esPrimerMovimiento(tablero) {
    const fichasTotales = tablero.filter(valor => valor !== 0).length;
    return fichasTotales <= 1;
}

// Toma el centro si esta disponible (posicion 4)
function tomarCentro(tablero) {
    return tablero[12] === 0 ? 12 : null;
}

// Toma una esquina si esta disponible (posiciones 0, 2, 6, 8)
function tomarEsquina(tablero) {
    const esquinas = [6, 8, 16, 18];
    const esquinasDisponibles = esquinas.filter(pos => tablero[pos] === 0);
    return esquinasDisponibles.length > 0 ? esquinasDisponibles[0] : null;
}

// Funcio,n principal que coordina toda la logica de decision de la I,A
function obtenerMejorMovimiento(tablero) {
    const jugadorIA = identificarJugador(tablero);
    let resultados = []
    // Si es el primer movimiento, siempre tomar centro o esquina
    if (esPrimerMovimiento(tablero)) {
        const centro = tomarCentro(tablero);
        if (centro !== null) return centro;

        const esquina = tomarEsquina(tablero);
        if (esquina !== null) return esquina;
    }

    const columnas = [
        // verticales
        [0, 5, 10, 15],
        [1, 6, 11, 16],
        [2, 7, 12, 17],
        [3, 8, 13, 18],
        [4, 9, 14, 19],
        // verticales (desde abajo)
        [20, 15, 10, 5],
        [21, 16, 11, 6],
        [22, 17, 12, 7],
        [23, 18, 13, 8],
        [24, 19, 14, 9],
        // horizontales
        [0, 1, 2, 3],
        [5, 6, 7, 8],
        [10, 11, 12, 13],
        [15, 16, 17, 18],
        [20, 21, 22, 23],
        // horizontales (desde la izquierda)
        [4, 3, 2, 1],
        [9, 8, 7, 6],
        [14, 13, 12, 11],
        [19, 18, 17, 16],
        [24, 23, 22, 21],
        // diagonales
        [0, 6, 12, 18],
        [20, 16, 12, 8],
        // diagonales (desde la izquierda)
        [4, 8, 12, 16],
        [24, 18, 12, 6],
        // diagonales de 4
        [15, 11, 7, 3],
        [21, 17, 13, 9],
        // diagonales de 4(desde arriba)
        [1, 7, 13, 19],
        [5, 11, 17, 23]
    ]
    for (let i = 0; i < columnas.length; i++) {
        resultados.push(analizarColumna(tablero, columnas[i], jugadorIA));
    }
    // Filtrar solo los resultados que tienen un movimiento valido
    const resultadosValidos = resultados.filter(resultado => resultado.movimiento !== undefined);

    // Si no hay resultados validos, tomar cualquier posicion vacia
    if (resultadosValidos.length === 0) {
        const posicionesVacias = obtenerPosicionesVacias(tablero);
        return posicionesVacias[0];
    }

    // Encontrar la mejor prioridad (numero mas bajo = mayor prioridad)
    const mejorPrioridad = Math.min(...resultadosValidos.map(r => r.prioridad));
    const mejoresOpciones = resultadosValidos.filter(r => r.prioridad === mejorPrioridad);

    // Si hay empate en prioridad, elegir una opcion al azar
    const opcionElegida = mejoresOpciones[Math.floor(Math.random() * mejoresOpciones.length)];
    return opcionElegida.movimiento;
}

// Endpoint principal que recibe el tablero y devuelve el mejor movimiento
app.get('/move', (req, res) => {
    let parametroTablero = req.query.board;
    let tablero;
    try {
        tablero = JSON.parse(parametroTablero);
    } catch (e) {
        return res.status(400).json({ error: 'Parámetro board inválido. Debe ser un array JSON.' });
    }
    if (!Array.isArray(tablero) || tablero.length !== 25) {
        return res.status(400).json({ error: 'El tablero debe ser un array de 25 posiciones.' });
    }
    const posicionesVacias = tablero
        .map((valor, indice) => valor === 0 ? indice : null)
        .filter(indice => indice !== null);

    if (posicionesVacias.length === 0) {
        return res.status(400).json({ error: 'No hay movimientos disponibles.' });
    }

    const movimiento = obtenerMejorMovimiento(tablero);
    res.json({ movimiento: movimiento });
});

/*   ARREGLAR
   
por alguna razon cuando quiero ejecutar el test con este pedazo de codigo no funciona correctamente:
(Jest did not exit one second after the test run has completed.

'This usually means that there are asynchronous operations that weren't stopped in your tests. 
Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.)*/

/*Iniciar el servidor en el puerto configurado
app.listen(PUERTO, () => {
    console.log(`Servidor de tateti escuchando en el puerto ${PUERTO}`);
});*/

module.exports = {
    identificarJugador,
    obtenerPosicionesVacias,
    analizarColumna,
    obtenerMejorMovimiento
}