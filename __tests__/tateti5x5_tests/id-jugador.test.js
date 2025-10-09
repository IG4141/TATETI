const { identificarJugador } = require('../../utils/tateti5x5.js')


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