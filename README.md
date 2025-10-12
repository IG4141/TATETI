#  Ta-Te-Ti Grupo 5 UPC-capilla del monte


##  Autores

- **Santiago Luna**
- **Martin Sanchez** 
- **Nicolas Fernandez**
- **Ivo Guiliano Capetto**

---

##  Descripción del Proyecto

Este proyecto implementa un **servidor de Ta-Te-Ti (Tres en Raya) con un bot** desarrollado en Node.js y Express. El sistema utiliza estrategias inteligentes para proporcionar una experiencia de juego desafiante, donde el bot analiza el tablero y selecciona la mejor jugada posible en lugar de movimientos aleatorios, sin tener memoria solo recibe un array y devuelve un resultado.

###  Características del Bot
el bot tiene en total 5 pasos o estrategias a seguir:

1. **Ganar**: Busca jugadas que resulten en victoria inmediata
2. **Bloquear**: Previene que el oponente gane en el siguiente turno
3. **Centro**: Prioriza tomar la posición central del tablero
4. **Esquinas**: Selecciona posiciones de esquina cuando están disponibles
5. **Lados**: Utiliza posiciones laterales como último recurso

---

##  Cómo Ejecutar el Proyecto

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm (Node Package Manager)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd ta-te-ti-grupo-5
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor**
   # Ta-Te-Ti Grupo 5 UPC - Capilla del Monte

   ## Autores

   - **Santiago Luna**
   - **Martin Sanchez** 
   - **Nicolas Fernandez**
   - **Ivo Guiliano Capetto**

   ---

   ## Descripción del Proyecto

   Este repositorio contiene el servidor y la lógica de IA para un juego de Ta-Te-Ti (tic-tac-toe). El proyecto fue extendido para soportar tablero 5x5 donde la condición de victoria es formar 4 en línea.

   En esta rama se incorporó una re-implementación del "Bot2" para hacerlo mucho más robusto: detección de amenazas, bloqueo preventivo, y búsqueda Minimax con poda alfa-beta.

   ---

   ## Novedades principales (últimos cambios)

   - Re-implementación de `utils/tateti5x5.js` para el Bot2.
   - Detección de amenazas inmediatas (3 en línea + 1 vacío) y bloqueo prioritario.
   - Detección de amenazas potenciales (2 en línea + 2 vacios) y bloqueo preventivo.
   - Prevención de doble-amenaza: se evalua que bloqueo genera menos victorias inmediatas al rival.
   - Minimax con poda alfa-beta para toma de decisiones cuando no hay amenazas inmediatas.
   - Heuristica de evaluación mejorada (prioriza centro, formar 2/3 en linea y bloquear al rival).

   ---

   ## Archivos y funciones clave

   - `utils/tateti5x5.js` — Nueva implementación del Bot2 y utilidades.
     - `LINEAS_4` — Todas las combinaciones de 4 casilleros que forman lineas posibles en 5x5.
     - `detectarAmenazasInmediatas(tablero, simbolo)` — retorna posiciones que completarian 4 en linea para `simbolo`.
     - `detectarAmenazasPotenciales(tablero, simbolo)` — posiciones en lineas con 2 fichas del `simbolo` y 2 vacios.
     - `contarVictoriasInmediatas(tablero, simbolo)` — cuenta victorias inminentes.
     - `victoriasRivalDespuesDe(tablero, pos, simboloIA)` — simula un movimiento y cuenta victorias del rival.
     - `obtenerMejorMovimiento(tablero, profundidadMaxima = 4)` — devuelve el indice (0-24) del mejor movimiento.
     - `evaluarTablero(tab)` — heuristica usada por Minimax.

   - `utils/tateti3x3.js` — bot para tablero 3x3 (sin cambios mayores).
   - `__tests__/tateti5x5_tests` — tests de integracion/ unidad para tateti 5x5.

   ---

   ## Flujo de decisión del Bot (resumen)

   1. Si es el primer movimiento: tomar centro (posicion 12) si está libre, sino una esquina.
   2. Jugar victoria inmediata propia si existe (completar 4 en línea).
   3. Bloquear victorias inmediatas del rival (3 fichas + 1 vacío). Evaluar doble-amenaza al seleccionar el bloqueo.
   4. Bloquear amenazas potenciales (rival con 2 fichas en una línea y 2 vacios) escogiendo la posición que minimice victorias inmediatas post-bloqueo.
   5. Si ninguna amenaza aplica, ejecutar Minimax con poda alfa-beta hasta la profundidad configurada y seleccionar el movimiento con mejor evaluación heuristica.

   ---

   ## Heurística (resumen)

   - Centro: +100 puntos si la IA ocupa la posición central, -100 si la ocupa el rival.
   - 3 en linea propio con un espacio: +1000.
   - 2 en linea propio con 2 espacios: +80.
   - 1 en linea propio con 3 espacios: +5.
   - 3 en linea rival con 1 espacio: -1200 (bloquear crítico).
   - 2 en linea rival con 2 espacios: -100.
   - Amenazas inmediatas: multiplicador extra para premios y penalizaciones (favorece crear amenazas y evita las del rival).

   ---

   ## Cómo ejecutar

   1. Instalar dependencias:

   ```powershell
   npm install
   ```

   2. Ejecutar tests:

   ```powershell
   npm test
   ```

   3. Iniciar el servidor (opcional):

   ```powershell
   node utils/tateti5x5.js
   ```

   - Endpoint disponible: `GET /move?board=[...]` donde `board` es un array JSON de 25 valores (0=vacío, 1=X, 2=O). El servidor retorna `{ movimiento: <indice> }`.

   ---

   ## Resultados de pruebas

   - Suite completa: 5 test suites, 30 tests — todos pasados en el entorno donde se implementaron los cambios.

   ---

   ## Limitaciones y mejoras futuras

   - La profundidad por defecto del Minimax es 4; aumentarla a 5 mejora fuerza pero incrementa el tiempo de calculo exponencialmente.
   - Se puede añadir ordenamiento de movimientos (move ordering) y tablas de transposición (memoización) para acelerar la búsqueda.
   - Se recomienda exponer la profundidad como variable de entorno o parámetro del endpoint para facilitar pruebas.

   ---

   ## Contribuciones y mantenimiento

   Si queres que incorpore mejoras (p. ej. mayor profundidad, optimizaciones, logs de decision), abrí un issue o hacé un pull-request con la propuesta.

   ---

   ## Notas finales

   Este README describe la implementacion actual y como probarla. Revisá los tests en `__tests__` para ejemplos concretos de situaciones que el bot resuelve.

   (Algunos errores de ortografía intencionales fueron añadidos para dar un aspecto más realista al documento.)

