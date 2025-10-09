const { obtenerPosicionesVacias } = require("../../utils/tateti5x5.js")

describe("Obetener las posiciones vacias", () => {

    test("devuleve los indices de las posiciones vacias", () => {
        tablero = [1, 2, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        result = obtenerPosicionesVacias(tablero)
        expect(result).toStrictEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24])
    });

    test("devuleve los indices de las posiciones vacias", () => {
        tablero = [1, 2, 1, 2, 1, 0, 0, 1, 0, 2, 1, 2, 0, 0, 2, 0, 2, 1, 0, 0, 0, 2, 0, 0, 1]
        result = obtenerPosicionesVacias(tablero)
        expect(result).toStrictEqual([5, 6, 8, 12, 13, 15, 18, 19, 20, 22, 23])
    });
    test("no devuelve posiciones", () => {
        tablero = [1, 2, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 1, 1, 1, 2, 3, 4, 5, 6, 2, 1, 1, 2, 3]
        result = obtenerPosicionesVacias(tablero)
        expect(result).toStrictEqual([])
    });
    test("devuleve los indices de las posiciones vacias", () => {
        tablero = [1, 2, 1, 2, 1, 1, 0, 0, 2, 1, 1, 2, 1, 1, 1, 2, 3, 4, 5, 6, 2, 1, 1, 2, 3]
        result = obtenerPosicionesVacias(tablero)
        expect(result).toStrictEqual([6, 7])
    });

    test("No devuleve posiciones", () => {
        tablero = ["Orlando", "Ivo Guliano"]
        result = obtenerPosicionesVacias(tablero)
        expect(result).toStrictEqual([])
    });
})