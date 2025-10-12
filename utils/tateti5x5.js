const express = require('express');
const app = express();
const PUERTO = process.env.PORT || 3004;

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
    const posicionVacia = posiciones.findLast(pos => tablero[pos] === 0);
    const diagonalesde4 = [
        [15, 11, 7, 3],
        [21, 17, 13, 9],
        [1, 7, 13, 19],
        [5, 11, 17, 23]
    ]
    // Prioridad 1: Victoria inminente (3 nuestras + 1 vacia)
    if (fichasIA === 3 && casillerosVacios === 1) {
        return { prioridad: 1, movimiento: posicionVacia };
    }
    // Prioridad 2: Bloquear al oponente (3 rivales + 1 vacia)
    else if (fichasOponente === 3 && casillerosVacios === 1) {
        return { prioridad: 2, movimiento: posicionVacia };
    }
    // Prioridad 3: Posibilidad de victoria (2 nuestras + 2 vacias)
    else if (fichasIA === 2 && casillerosVacios === 2) {
        return { prioridad: 3, movimiento: posicionVacia };
    }
    // Prioridad 4: Bloquear al oponente (2 rivales + 2 vacias)
    else if (fichasOponente === 2 && casillerosVacios === 2) {
        return { prioridad: 4, movimiento: posicionVacia };
    }  // Prioridad 4.1: Posibilidad de victoria (2 nuestras + 2 vacias)
    else if (posiciones.includes(diagonalesde4) && fichasIA === 2 && casillerosVacios === 2) {
        return { prioridad: 4.1, movimiento: posicionVacia };
    }
    // Prioridad 4.2: Bloquear al oponente en diagonal de 4 casilleros (2 rivales + 2 vacias menos importante ) 
    else if (posiciones.includes(diagonalesde4) && fichasOponente === 2 && casillerosVacios === 2)
        return { prioridad: 4.2, movimiento: posicionVacia }
    // Prioridad 5: Bloquear al rival (1 rival + 3 vacias)
    else if (fichasOponente === 1 && casillerosVacios === 3) {
        return { prioridad: 5, movimiento: posicionVacia };
    }
    // Prioridad 6: Posibiliad de victoria (1 nuestra + 3 vacias)
    else if (fichasIA === 1 && casillerosVacios === 3) {
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

// Todas las líneas posibles de 4 en el tablero 5x5 (listas de indices)
const LINEAS_4 = [
    // verticales (desde arriba)
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
];

// Devuelve posiciones donde el simbolo dado tiene 3 en una linea de 4 y 1 vacio (amenaza inmediata)
function detectarAmenazasInmediatas(tablero, simbolo) {
    const amenazas = [];
    for (const linea of LINEAS_4) {
        const valores = linea.map(pos => tablero[pos]);
        const contadorSimbolo = valores.filter(v => v === simbolo).length;
        const contadorVacios = valores.filter(v => v === 0).length;
        if (contadorSimbolo === 3 && contadorVacios === 1) {
            const idxVacio = linea.find(pos => tablero[pos] === 0);
            if (idxVacio !== undefined) amenazas.push(idxVacio);
        }
    }
    return [...new Set(amenazas)];
}

// Devuelve posiciones vacias en lineas donde 'simbolo' tiene exactamente 2 fichas y 2 vacios
function detectarAmenazasPotenciales(tablero, simbolo) {
    const posiciones = [];
    for (const linea of LINEAS_4) {
        const valores = linea.map(pos => tablero[pos]);
        const contadorSimbolo = valores.filter(v => v === simbolo).length;
        const contadorVacios = valores.filter(v => v === 0).length;
        if (contadorSimbolo === 2 && contadorVacios === 2) {
            for (const pos of linea) {
                if (tablero[pos] === 0) posiciones.push(pos);
            }
        }
    }
    return [...new Set(posiciones)];
}

// Cuenta cuantas victorias inmediatas (3 en linea + 1 vacio) tiene un simbolo en el tablero
function contarVictoriasInmediatas(tablero, simbolo) {
    return detectarAmenazasInmediatas(tablero, simbolo).length;
}

// Simula colocar en 'pos' el simboloIA y calcula cuantas victorias inmediatas tendría el rival
function victoriasRivalDespuesDe(tablero, pos, simboloIA) {
    const tableroSim = tablero.slice();
    tableroSim[pos] = simboloIA; // colocamos la ficha de la IA
    const simboloRival = simboloIA === 1 ? 2 : 1;
    return contarVictoriasInmediatas(tableroSim, simboloRival);
}

// Funcion principal que coordina toda la logica de decision de la IA
// Implementa Minimax con poda alfa-beta, deteccion de amenazas inmediatas y bloqueo
function obtenerMejorMovimiento(tablero, profundidadMaxima = 4) {
    const jugadorIA = identificarJugador(tablero);
    const simboloRival = jugadorIA === 1 ? 2 : 1;

    // 1) Primer movimiento simple: centro si está, sino esquina
    if (esPrimerMovimiento(tablero)) {
        const centro = tomarCentro(tablero);
        if (centro !== null) return centro;
        const esquina = tomarEsquina(tablero);
        if (esquina !== null) return esquina;
    }

    // 2) Victoria inmediata propia: juegue donde complete 4 en linea
    const misVictorias = detectarAmenazasInmediatas(tablero, jugadorIA);
    if (misVictorias.length > 0) {
        return misVictorias[0];
    }

    // 3) Bloquear victorias inmediatas del rival (prioridad absoluta)
    const bloques = detectarAmenazasInmediatas(tablero, simboloRival);
    if (bloques.length > 0) {
        // Evitar crear doble amenaza: elegir el bloqueo que minimice victorias del rival tras nuestro movimiento
        let mejorPos = bloques[0];
        let mejorScore = Infinity;
        for (const pos of bloques) {
            const victoriasTrasBloqueo = victoriasRivalDespuesDe(tablero, pos, jugadorIA);
            if (victoriasTrasBloqueo < mejorScore) {
                mejorScore = victoriasTrasBloqueo;
                mejorPos = pos;
            }
            if (mejorScore === 0) break; // óptimo
        }
        return mejorPos;
    }

    // 3b) Bloquear amenazas potenciales (rival tiene 2 en linea y 2 vacios)
    const potenciales = detectarAmenazasPotenciales(tablero, simboloRival);
    if (potenciales.length > 0) {
        // Elegir la posicion que minimice las victorias inmediatas del rival despues de nuestro movimiento
        let mejorPos = potenciales[0];
        let mejorScore = Infinity;
        for (const pos of potenciales) {
            const victoriasTras = victoriasRivalDespuesDe(tablero, pos, jugadorIA);
            if (victoriasTras < mejorScore) {
                mejorScore = victoriasTras;
                mejorPos = pos;
            }
            if (mejorScore === 0) break;
        }
        return mejorPos;
    }

    // 4) No hay amenazas inmediatas: usar Minimax con poda alfa-beta
    const disponibles = obtenerPosicionesVacias(tablero);
    if (disponibles.length === 0) return null;

    // Helper: detecta victoria real (4 en linea) para un simbolo
    function hayVictoria(tab, simbolo) {
        for (const linea of LINEAS_4) {
            if (linea.every(p => tab[p] === simbolo)) return true;
        }
        return false;
    }

    // Heuristica de evaluacion: más positiva es mejor para jugadorIA
    function evaluarTablero(tab) {
        const rival = simboloRival;
        let score = 0;

        // Priorizar centro
        const centro = 12;
        if (tab[centro] === jugadorIA) score += 100;
        else if (tab[centro] === rival) score -= 100;

        // Evaluar cada linea de 4
        for (const linea of LINEAS_4) {
            const vals = linea.map(p => tab[p]);
            const mi = vals.filter(v => v === jugadorIA).length;
            const su = vals.filter(v => v === rival).length;
            const vac = vals.filter(v => v === 0).length;

            if (mi > 0 && su === 0) {
                // Ponderaciones: 3 en linea > 2 en linea > 1
                if (mi === 3 && vac === 1) score += 1000;
                else if (mi === 2 && vac === 2) score += 80;
                else if (mi === 1 && vac === 3) score += 5;
            } else if (su > 0 && mi === 0) {
                if (su === 3 && vac === 1) score -= 1200; // bloquear crítico
                else if (su === 2 && vac === 2) score -= 100;
                else if (su === 1 && vac === 3) score -= 5;
            }
        }

        // Amenazas inmediatas cuentan mucho (crear múltiple amenaza es valioso)
        const misAmenazas = detectarAmenazasInmediatas(tab, jugadorIA).length;
        const susAmenazas = detectarAmenazasInmediatas(tab, rival).length;
        score += misAmenazas * 400;
        score -= susAmenazas * 600;

        return score;
    }

    // Minimax recursivo con poda alfa-beta
    function minimax(tab, depth, alpha, beta, isMaximizing) {
        if (hayVictoria(tab, jugadorIA)) return { score: 100000 + depth, movimiento: null };
        if (hayVictoria(tab, simboloRival)) return { score: -100000 - depth, movimiento: null };

        const moves = obtenerPosicionesVacias(tab);
        if (moves.length === 0 || depth === 0) return { score: evaluarTablero(tab), movimiento: null };

        let bestMove = null;

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const m of moves) {
                const nuevo = tab.slice();
                nuevo[m] = jugadorIA;
                const res = minimax(nuevo, depth - 1, alpha, beta, false).score;
                if (res > maxEval) {
                    maxEval = res;
                    bestMove = m;
                }
                alpha = Math.max(alpha, res);
                if (beta <= alpha) break; // poda
            }
            return { score: maxEval, movimiento: bestMove };
        } else {
            let minEval = Infinity;
            for (const m of moves) {
                const nuevo = tab.slice();
                nuevo[m] = simboloRival;
                const res = minimax(nuevo, depth - 1, alpha, beta, true).score;
                if (res < minEval) {
                    minEval = res;
                    bestMove = m;
                }
                beta = Math.min(beta, res);
                if (beta <= alpha) break; // poda
            }
            return { score: minEval, movimiento: bestMove };
        }
    }

    const resultado = minimax(tablero, profundidadMaxima, -Infinity, Infinity, true);
    return resultado.movimiento !== null ? resultado.movimiento : disponibles[0];
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




//Iniciar el servidor en el puerto 
if (require.main === module) {
    app.listen(PUERTO, () => {
        console.log(`Servidor de tateti escuchando en el puerto ${PUERTO}`);
    })
};

module.exports = {
    identificarJugador,
    obtenerPosicionesVacias,
    analizarColumna,
    obtenerMejorMovimiento
}

