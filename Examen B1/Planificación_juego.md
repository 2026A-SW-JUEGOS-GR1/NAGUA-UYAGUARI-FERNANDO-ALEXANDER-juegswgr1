# Planificación
## Nombre del juego
Nova Space
## Stack Tecnológico
- **Motor de Videojuegos:** Phaser 3 (Framework de desarrollo de videojuegos en 2D basado en JavaScript/TypeScript).    
- **Herramienta de Diseño de Escenarios:** Tiled Map Editor (Generación de mapas basados en azulejos/tiles mediante la exportación de archivos estructurados JSON).    
- **Entorno de Ejecución:** Navegador Web compatible con renderizado WebGL/Canvas nativo de Phaser 3.
## Narrativa y documentación
- **Premisa:** El jugador controla a la nave de exploración _Astro-FIS_, la cual ha quedado varada en un cinturón de asteroides hostil tras un fallo en su motor de hipervelocidad.    
- **Protagonista y Objetivo:** Eres el último piloto de la flota. Tu objetivo es pilotar la nave en una perspectiva superior (Top-Down), esquivando asteroides masivos y destruyendo las sondas alienígenas automatizadas que defienden el sector, resistiendo el asedio el tiempo suficiente hasta recoger las celdas den energía necesarias para que los motores se recarguen para el salto espacial.    
- **Justificación del Entorno:** El espacio exterior justifica la ausencia de gravedad vertical convencional (permitiendo movimiento libre en los ejes X e Y) y el uso de un entorno oscuro decorado con campos de asteroides que delimitan las zonas seguras de navegación.
## Estructura del Escenario y Entorno (Tiles)
Para cumplir con el requerimiento estético de usar _tiles_ sin perder tiempo en herramientas externas:
- **El Fondo Dinámico:** Se utilizará un `TileSprite` en Phaser con una textura de estrellas repetitiva. En el método `update`, se desfasa el mapa sutilmente según el movimiento de la nave para dar una sensación real de desplazamiento en el espacio profundo.
- **Los Límites y Obstáculos:** Se creará un array lógico o un grupo estático que pinte **Asteroides Gigantes** distribuidos en los bordes de la pantalla y alrededor del escenario como obstáculos fijos. Estos actuarán como las "paredes sólidas" obligatorias con las que la nave colisionará físicamente, bloqueando su paso
## Arquitectura del Flujo del Juego (Escenas de Phaser 3)
El proyecto se dividirá en 4 escenas independientes y limpias para garantizar una correcta arquitectura de software:
### Escena 1: `MenuScene` (Menú de Inicio)
- **Interfaz:** Título llamativo, fondo espacial estático y un botón interactivo para comenzar.  
- **Reglas Básicas en Pantalla:** Texto explícito: _"Pilota con las Flechas del teclado. Dispara con la Barra Espaciadora. Sobrevive al asedio y recoge celdas de energía para ganar."_
### Escena 2: `GameScene` (El Núcleo del Juego)
Aquí se ejecuta la lógica principal y las interacciones físicas:
- **Controles y Vectores:** Se mapean las flechas del teclado. Al presionarlas, se modifican los componentes de velocidad del cuerpo físico de la nave permitiendo desplazarse fluidamente en 8 direcciones combinando ejes X e Y.
- **Spritesheet y Animación:** La nave contará con un _spritesheet_ de 3 cuadros de animación. Cuando no se presionen teclas, mostrará el propulsor apagado; al avanzar hacia adelante o a los lados, la animación reproducirá de forma fluida el fuego del motor de plasma expulsado de manera coherente con la dirección de movimiento.    
- **Lógica de Combate y Spawn:** Un temporizador cíclico creará naves enemigas en los bordes de la pantalla cada cierta cantidad de segundos, las cuales avanzarán vectorialmente hacia la posición de la nave del jugador. El jugador generará proyectiles láser al presionar la barra espaciadora. Además, cada que se elimina un enemigo, este tiene una cierta probabilidad de que suelte una celda de energía que deberá ser recogida por el jugador.
#### Escenas 3 y 4: `VictoryScene` y `GameOverScene` (Condiciones de Fin)
- **Sistema de Score (HUD):** Un texto activo en la esquina superior izquierda de la pantalla actualiza los puntos del jugador en tiempo real (100 puntos por cada sonda enemiga destruida).   
- **Condición de Victoria:** Si el jugador llega a recoger 10 celdas de energía, la escena se detiene y redirige al usuario a la pantalla de Victoria.    
- **Condición de Derrota:** El jugador inicia con 3 puntos de vida (o un escudo al 100%). Cada vez que una nave enemiga o un asteroide choque físicamente contra el jugador, se reduce la barra de salud. Si llega a 0, se gatilla la escena de Fin de Partida (Game Over). Ambas pantallas finales incluirán un botón para reiniciar el juego de manera limpia.
# Requerimientos
## Funcionales
### Fase de Flujo y Control de Escenas (Arquitectura de Software)
- **RF-01: Menú Principal (`MenuScene`):** El sistema debe desplegar una interfaz gráfica inicial antes de cargar el bucle de juego. Debe incluir de forma obligatoria:    
    - Título del videojuego.        
    - Instrucciones explícitas de control: _"Pilota con las Flechas del teclado. Dispara con la Barra Espaciadora. Sobrevive al asedio y recoge celdas de energía para ganar."_ 
    - Un botón/elemento interactivo que limpie la memoria latente e inicialice la escena principal.     
    - Un texto con la puntuación máxima alcanzada
- **RF-02: Escena Terminal de Victoria (`VictoryScene`):** El sistema redirigirá al usuario a esta pantalla cuando el jugador cumpla la condición de éxito (recolectar 10 celdas de energía). Mostrará un mensaje de felicitación, el _Score_ final obtenido y un botón para reiniciar el flujo.    
- **RF-03: Escena Terminal de Derrota (`GameOverScene`):** El sistema interrumpirá el bucle de juego si la salud del jugador se reduce a 0. Desplegará el puntaje final y un botón interactivo de reinicio limpio de variables globales (vidas, puntaje y celdas).    
### Fase de Mecánicas de Juego y Físicas (`GameScene`)
- **RF-04: Movimiento Cinemático Top-Down:** El sistema debe procesar las entradas del teclado (_CursorKeys_) y traducirlas en vectores de velocidad dinámica simultánea en los ejes $X$ e $Y$ (8 direcciones de movimiento) , aplicando estrictamente la instrucción física `player.body.setVelocity(vx, vy);` sin verse afectado por gravedad constante.    
- **RF-05: Sistema de Disparo (Combate):** Al pulsar la barra espaciadora, la nave debe instanciar un objeto proyectil lineal (láser) que se desplace verticalmente hacia el eje $-Y$ con una velocidad constante predefinida.    
- **RF-06: Spawn Automatizado de Sondas Enemigas:** El sistema ejecutará un temporizador cíclico en segundo plano (`this.time.addEvent`) que instancie naves enemigas en las coordenadas del borde perimetral de la pantalla. Cada unidad enemiga calculará dinámicamente un vector de persecución hacia la posición cambiante de la nave del jugador.    
- **RF-07: Probabilidad de Drop (Celdas de Energía):** Al ocurrir la destrucción de una sonda enemiga por un proyectil del jugador, el sistema calculará un número pseudoaleatorio. Si se cumple el porcentaje de probabilidad configurado, se instanciará una "Celda de Energía" inercial en las coordenadas exactas donde fue abatido el enemigo.   
### Fase de Colisiones e Interacciones Físicas
- **RF-08: Colisión Sólida (Obstáculos del Mapa):** El sistema debe procesar colisiones rígidas (`this.physics.add.collider`) entre la nave del jugador y los Asteroides Gigantes (delimitados estáticamente por la matriz de _tiles_). El impacto debe bloquear por completo el paso del vector del jugador sin atravesar el _sprite_.    
- **RF-09: Intersección Bala-Enfrentamiento (_Overlap_):** El sistema detectará la superposición entre los proyectiles del jugador y las sondas enemigas. La consecuencia inmediata será la destrucción mutua de ambas entidades, la suma de puntos en el marcador y el disparo del cálculo del _drop_ de energía.
- **RF-10: Intersección Jugador-Daño:** El sistema evaluará el contacto físico directo entre la nave del jugador y cualquier sonda enemiga o asteroide. Cada impacto reducirá el medidor de salud/escudo y otorgará inmunidad temporal parpadeante al jugador para evitar muertes instantáneas por _bugeos_ de frames.    
- **RF-11: Recolección de Celdas:** El sistema detectará la colisión entre el jugador y las celdas de energía esparcidas por el mapa. Al hacer contacto, el contador interno de celdas se incrementará en $+1$ y la entidad de la celda se eliminará del entorno de ejecución.
### Fase de HUD e Interfaz Gráfica Activa
- **RF-12: Marcador en Tiempo Real (Score):** La pantalla de juego debe renderizar un texto estático (HUD) en la esquina superior izquierda que registre e incremente dinámicamente $+100$ puntos por cada sonda eliminada.    
- **RF-13: Contador de Objetivos:** El HUD debe desplegar de manera visible el conteo actual de celdas de energía recolectadas frente al total requerido para ganar (ej. `Celdas: X / 10`).RF-01: Menú Principal (￼￼MenuScene￼￼):￼￼ El sistem
## No funcionales
- **RNF-01: Estética Multimedia y Gráficos Animados:** El motor gráfico debe renderizar bucles de animación fluidos según el estado cinemático : si la velocidad de la nave en $X$ o $Y$ es diferente de cero, se reproducirá la animación de las partículas de plasma encendidas; de lo contrario, se mostrará el cuadro estático del propulsor apagado.   
- **RNF-02: Rendimiento Espacial (Fondo Dinámico):** Para simular un entorno infinito en un escenario acotado, el fondo estelar debe ser un componente `TileSprite` de Phaser 3, cuyo desplazamiento horizontal y vertical se desfase analíticamente de forma inversa en el método `update` en función de la velocidad real de la nave, optimizando el consumo de renderizado al no sobrecargar el árbol de nodos DOM.  
- **RNF-03: Paisaje Sonoro Completo**
	- **Música (BGM):** El sistema debe inicializar un canal de audio estéreo que reproduzca una pista instrumental de forma continua e infinita (`loop: true`) durante la ejecución de la escena del juego.    
	- **Efectos (SFX):** Los eventos síncronos de disparo (barra espaciadora), explosión (destrucción de sondas) y daño recibido deben interrumpir momentáneamente el espectro auditivo con efectos de sonido de corta duración (menores a 1.5 segundos).
# Desarrollo
- **Hito 1 (Mecánica Base):** Programa el movimiento del jugador y la caída de los objetos. Si puedes moverte y los objetos caen, has completado el núcleo.    
- **Hito 2 (Lógica de Juego):** Programa las colisiones (hacer daño/morir) y el sistema de puntos (sumar un punto por cada segundo sobrevivido o cada objeto esquivado).    
- **Hito 3 (Ciclo de Vida de la Partida):** Conecta la UI. Haz que al morir aparezca el menú de Game Over y que al presionar una tecla el juego se reinicie por completo limpiando la pantalla.
