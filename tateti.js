const express = require('express');
const app = express();
const PUERTO = 3000;

function identificarJugador(tablero) {
    const fichasX = tablero.filter(valor => valor === 1).length;
    const fichasO = tablero.filter(valor => valor === 2).length;
    
    if (fichasX === fichasO) {
        return 1;
    } else if (fichasX > fichasO) {
        return 2;
    } else {
        return 1;
    }
}

function obtenerPosicionesVacias(tablero) {
    return tablero
        .map((valor, indice) => valor === 0 ? indice : null)
        .filter(indice => indice !== null);
}

function realizarMovimiento(tablero, posicion, jugador) {
    const nuevoTablero = [...tablero];
    nuevoTablero[posicion] = jugador;
    return nuevoTablero;
}

function verificarGanador(tablero, jugador) {
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let combinacion of combinacionesGanadoras) {
        const [a, b, c] = combinacion;
        if (tablero[a] === jugador && tablero[b] === jugador && tablero[c] === jugador) {
            return true;
        }
    }
    return false;
}

function intentarGanar(tablero, jugador) {
    const posicionesVacias = obtenerPosicionesVacias(tablero);
    
    for (let posicion of posicionesVacias) {
        const tableroPrueba = realizarMovimiento(tablero, posicion, jugador);
        if (verificarGanador(tableroPrueba, jugador)) {
            return posicion;
        }
    }
    return null;
}

function bloquearOponente(tablero, jugador) {
    const oponente = jugador === 1 ? 2 : 1;
    return intentarGanar(tablero, oponente);
}

function tomarCentro(tablero) {
    return tablero[4] === 0 ? 4 : null;
}

function tomarEsquina(tablero) {
    const esquinas = [0, 2, 6, 8];
    const esquinasDisponibles = esquinas.filter(pos => tablero[pos] === 0);
    return esquinasDisponibles.length > 0 ? esquinasDisponibles[0] : null;
}

function tomarLado(tablero) {
    const lados = [1, 3, 5, 7];
    const ladosDisponibles = lados.filter(pos => tablero[pos] === 0);
    return ladosDisponibles.length > 0 ? ladosDisponibles[0] : null;
}

function obtenerMejorMovimiento(tablero) {
    const jugadorIA = identificarJugador(tablero);
    
    let movimiento = intentarGanar(tablero, jugadorIA);
    if (movimiento !== null) return movimiento;
    
    movimiento = bloquearOponente(tablero, jugadorIA);
    if (movimiento !== null) return movimiento;
    
    movimiento = tomarCentro(tablero);
    if (movimiento !== null) return movimiento;
    
    movimiento = tomarEsquina(tablero);
    if (movimiento !== null) return movimiento;
    
    movimiento = tomarLado(tablero);
    if (movimiento !== null) return movimiento;
    
    const posicionesVacias = obtenerPosicionesVacias(tablero);
    return posicionesVacias[0];
}

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

app.listen(PUERTO, () => {
    console.log(`Servidor de tateti escuchando en el puerto ${PUERTO}`);
});