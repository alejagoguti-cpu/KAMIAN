# Almuerzo Jave — juego de recorrido cotidiano

Juego web tipo Snake sobre una situación cotidiana en la **Universidad Javeriana**: salir a comprar el almuerzo antes de que se termine el tiempo.

## Objetivo

La única meta es llegar a la cafetería y comprar el almuerzo. La persona se mueve por un mapa estilizado del campus, elige una ruta y evita obstáculos como el trancón, la lluvia y las filas largas. Cada partida comienza con una ventana de 45 segundos.

## Cómo jugar

- Presiona **Comenzar recorrido**.
- Muévete con las flechas del teclado o con **WASD**.
- En móvil, usa el pad de flechas visible debajo de la misión.
- Llega al marcador amarillo de **ALMUERZO**.
- Si chocas con un obstáculo, pierdes 3 segundos; si sales del mapa, pierdes 1 segundo.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Para comprobar los tipos y generar una compilación de producción:

```bash
pnpm check
pnpm build
```

## Estructura relevante

```text
client/src/pages/Home.tsx  # Lógica del juego, mapa, controles y estados de partida
client/src/index.css       # Dirección visual responsive del juego
client/public/manus-routes.json # Rutas declaradas para el runtime
```
