const { analizarColumna } = require('../../utils/tateti5x5')

describe('analizarColumna basic', () => {
	test('analizarColumna es una funcion', () => {
		expect(typeof analizarColumna).toBe('function')
	})
})

