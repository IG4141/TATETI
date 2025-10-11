const { obtenerMejorMovimiento } = require("../../utils/tateti5x5.js")

describe("Obtener el mejor movimiento y ", () => {

    test("ganar en la proxima jugada", () => {
        const tablero = [
            1, 1, 1, 0, 0,
            0, 2, 2, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        const result = obtenerMejorMovimiento(tablero)
        expect(result).toBe(3);
    })
    test("Bloquear a O", () => {
        const tablero = [
            2, 0, 0, 0, 0,
            2, 1, 0, 0, 0,
            2, 0, 1, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        const result = obtenerMejorMovimiento(tablero)
        expect(result).toBe(15);
    })
    test("Ganar", () => {
        const tablero = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 0, 0,
            2, 0, 0, 0, 2
        ];
        resultado = obtenerMejorMovimiento(tablero)
        expect(resultado).toBe(18);
    })

    test("Bloquear la diagonal", () => {
        const tablero = [
            1, 0, 0, 0, 0,
            1, 0, 2, 0, 0,
            1, 2, 0, 0, 0,
            2, 0, 0, 0, 0,
            1, 0, 0, 0, 0
        ];
        const resultado = obtenerMejorMovimiento(tablero)
        expect(resultado).toBe(3);
    });
    test("tomar el centro", () => {
        const tablero = [
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0]
        const resultado = obtenerMejorMovimiento(tablero)
        expect(resultado).toBe(12)
    });
    test("bloquear oponente", () => {
        const tablero = [
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            1, 0, 0, 0, 0,
            1, 0, 0, 0, 2]
        const resultado = obtenerMejorMovimiento(tablero)
        expect([10, 5]).toContain(resultado)
    });
    test("empate", () => {
        const tablero = [
            1, 2, 1, 2, 1,
            2, 1, 2, 1, 2,
            1, 2, 2, 1, 2,
            1, 2, 1, 2, 1,
            2, 1, 2, 0, 0]
        const resultado = obtenerMejorMovimiento(tablero)
        expect([23, 24]).toContain(resultado)
    });

});
