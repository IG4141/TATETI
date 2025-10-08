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

    // Prioridad 1: Victoria inminente (2 nuestras + 1 vacia)
    if (fichasIA === 2 && casillerosVacios === 1) {
        return { prioridad: 1, movimiento: posicionVacia };
    }
    // Prioridad 2: Bloquear al oponente (2 rivales + 1 vacia)
    else if (fichasOponente === 2 && casillerosVacios === 1) {
        return { prioridad: 2, movimiento: posicionVacia };
    }
    // Prioridad 3: Posibilidad de victoria (1 nuestra + 2 vacias)
    else if (fichasIA === 1 && casillerosVacios === 2) {
        return { prioridad: 3, movimiento: posicionVacia };
    }
    // Prioridad 4: Empate (1 nuestra + 1 rival + 1 vacia)
    else if (fichasIA === 1 && fichasOponente === 1 && casillerosVacios === 1) {
        return { prioridad: 4, movimiento: posicionVacia };
    }
    // Prioridad 5: No relevante (totalmente vacia, ocupada o 1 rival)
    else {
        return { prioridad: 5, movimiento: posicionVacia };
    }
}

// Funciones para analizar cada fila horizontal
function analizarFila1(tablero, jugadorIA) {
    return analizarColumna(tablero, [0, 1, 2], jugadorIA);
}

function analizarFila2(tablero, jugadorIA) {
    return analizarColumna(tablero, [3, 4, 5], jugadorIA);
}

function analizarFila3(tablero, jugadorIA) {
    return analizarColumna(tablero, [6, 7, 8], jugadorIA);
}

// Funciones para analizar cada columna vertical
function analizarColumna1(tablero, jugadorIA) {
    return analizarColumna(tablero, [0, 3, 6], jugadorIA);
}

function analizarColumna2(tablero, jugadorIA) {
    return analizarColumna(tablero, [1, 4, 7], jugadorIA);
}

function analizarColumna3(tablero, jugadorIA) {
    return analizarColumna(tablero, [2, 5, 8], jugadorIA);
}

// Funciones para analizar las diagonales
function analizarDiagonal1(tablero, jugadorIA) {
    return analizarColumna(tablero, [0, 4, 8], jugadorIA);
}

function analizarDiagonal2(tablero, jugadorIA) {
    return analizarColumna(tablero, [2, 4, 6], jugadorIA);
}

// Verifica si es el primer movimiento del juego (maximo 1 ficha en el tablero)
function esPrimerMovimiento(tablero) {
    const fichasTotales = tablero.filter(valor => valor !== 0).length;
    return fichasTotales <= 1;
}

// Toma el centro si esta disponible (posicion 4)
function tomarCentro(tablero) {
    return tablero[4] === 0 ? 4 : null;
}

// Toma una esquina si esta disponible (posiciones 0, 2, 6, 8)
function tomarEsquina(tablero) {
    const esquinas = [0, 2, 6, 8];
    const esquinasDisponibles = esquinas.filter(pos => tablero[pos] === 0);
    return esquinasDisponibles.length > 0 ? esquinasDisponibles[0] : null;
}

// Funcion principal que coordina toda la logica de decision de la IA
function obtenerMejorMovimiento(tablero) {
    const jugadorIA = identificarJugador(tablero);

    // Si es el primer movimiento, siempre tomar centro o esquina
    if (esPrimerMovimiento(tablero)) {
        const centro = tomarCentro(tablero);
        if (centro !== null) return centro;

        const esquina = tomarEsquina(tablero);
        if (esquina !== null) return esquina;
    }

    // Analizar todas las 8 columnas posibles (3 filas + 3 columnas + 2 diagonales)
    const resultados = [
        analizarFila1(tablero, jugadorIA),
        analizarFila2(tablero, jugadorIA),
        analizarFila3(tablero, jugadorIA),
        analizarColumna1(tablero, jugadorIA),
        analizarColumna2(tablero, jugadorIA),
        analizarColumna3(tablero, jugadorIA),
        analizarDiagonal1(tablero, jugadorIA),
        analizarDiagonal2(tablero, jugadorIA)
    ];

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
    if (!Array.isArray(tablero) || tablero.length !== 9) {
        return res.status(400).json({ error: 'El tablero debe ser un array de 9 posiciones.' });
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

/* Iniciar el servidor en el puerto configurado
app.listen(PUERTO, () => {
    console.log(`Servidor de tateti escuchando en el puerto ${PUERTO}`);
}); */

module.exports = {
    identificarJugador,
    analizarColumna1,
    obtenerMejorMovimiento
}