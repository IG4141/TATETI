const { identificarJugador } = require('../utils/tateti3x3.js')
const { analizarColumna1 } = require('../utils/tateti3x3.js')
const { obtenerMejorMovimiento } = require('../utils/tateti3x3.js')
describe('jugador identificado', () => {
    test("identificar jugador x al principio", () => {
        tablero = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        const result = identificarJugador(tablero)
        expect(result).toBe(1)
    })


    test("identificar jugador x ", () => {
        tablero = [1, 2, 0, 1, 0, 2, 0, 0, 0]
        const result = identificarJugador(tablero)
        expect(result).toBe(1)
    })


    test("identificar jugador O", () => {
        tablero = [0, 0, 0, 0, 1, 0, 0, 0, 0]
        const result = identificarJugador(tablero)
        expect(result).toBe(2)
    })


    test("identificar jugador O", () => {
        tablero = [0, 1, 2, 2, 1, 0, 1, 0, 0]
        const result = identificarJugador(tablero)
        expect(result).toBe(2)
    })
});




describe("Analizar Columna1", () => {
    test("Elegir movimieto ganador", () => {
        let tablero = [1, 0, 0, 1, 0, 0, 0, 0, 0]
        const jugadorIA = 1
        const result = analizarColumna1(tablero, jugadorIA)
        expect(result).toStrictEqual({ "movimiento": 6, "prioridad": 1 })
    })
    test("y evitar la derrota", () => {
        let tablero = [2, 0, 1, 0, 0, 0, 2, 0, 1]
        const jugadorIA = 1
        const result = analizarColumna1(tablero, jugadorIA)
        expect(result).toStrictEqual({ "movimiento": 3, "prioridad": 2 })

    })
})



describe("Obtener Mejor movimiento", () => {
    test("obtener el centro", () => {
        let tablero = [0, 0, 0, 0, 0, 0, 0, 0, 1]
        result = obtenerMejorMovimiento(tablero)
        expect(result).toBe(4)
    });

    test("ir a la esquina", () => {
        let tablero = [0, 0, 0, 0, 1, 0, 0, 0, 0]
        result = obtenerMejorMovimiento(tablero)
        expect([0, 2, 6, 8]).toContain(result)
    });


    test("ganar", () => {
        let tablero = [2, 2, 1, 2, 1, 1, 0, 0, 0]
        result = obtenerMejorMovimiento(tablero)
        expect([6, 8]).toContain(result)
    });
    test("ganar", () => {
        let tablero = [1, 2, 2, 0, 1, 0, 1, 0, 2]
        result = obtenerMejorMovimiento(tablero)
        expect(result).toBe(3)
    });

    test("empatar", () => {
        let tablero = [2, 2, 1, 2, 1, 1, 2, 1, 0]
        result = obtenerMejorMovimiento(tablero)
        expect(result).toStrictEqual(8)
    })
    test("empatar", () => {
        let tablero = [1, 2, 2, 0, 1, 0, 1, 0, 0]
        result = obtenerMejorMovimiento(tablero)
        expect(result).toStrictEqual(8)
    })

    test("no perder", () => {
        let tablero = [1, 2, 2, 1, 0, 0, 0, 1, 0]
        result = obtenerMejorMovimiento(tablero)
        expect(result).toBe(6)
    });


})