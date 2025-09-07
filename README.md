#  Ta-Te-Ti Grupo 5 UPC-capilla del monte


##  Autores

- **Santiago Luna**
- **Martin Sanches** 
- **Nicolas Fernandes**
- **Ivo Guiliano**

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
   ```bash
   npm start
   ```

4. **El servidor estará disponible en:**
   ```
   http://localhost:3000
   ```

### Uso de la API

#### Endpoint: Obtener Movimiento de la IA

```http
GET /move?board=[0,1,0,2,0,0,0,0,0]
```

**Parámetros:**
- `board`: Array JSON de 9 posiciones representando el tablero
  - `0`: Posición vacía
  - `1`: Jugador X
  - `2`: Jugador O

**Ejemplo de respuesta:**
```json
{
  "movimiento": 4
}
```

**Ejemplo de uso con curl:**
```bash
curl "http://localhost:3000/move?board=[0,1,0,2,0,0,0,0,0]"
```

---

##  Representación del Tablero

El tablero se representa como un array de 9 posiciones:

```
[0] [1] [2]
[3] [4] [5]
[6] [7] [8]
```

**Ejemplo:**
 `[0,1,0,2,0,0,0,0,0]` representa:
  ```
  [ ] [X] [ ]
  [O] [ ] [ ]
  [ ] [ ] [ ]
  ```

---

##  Institución

**Universidad Provincial de Córdoba (UPC)**  
**Sede Capilla del Monte**

---

##  Estructura del Proyecto

```
ta-te-ti-grupo-5/
├── tateti.js          # Servidor principal con lógica de IA
├── package.json       # Configuración del proyecto y dependencias
├── package-lock.json  # Lock file de dependencias
└── README.md         # Documentación del proyecto
```

---

##  Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web para Node.js
- **JavaScript ES6+**: Lenguaje de programación
- **Algoritmos de IA**: Estrategias inteligentes para el juego

