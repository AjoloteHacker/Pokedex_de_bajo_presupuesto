# Pokedex de Bajo Presupuesto

Aplicacion web basada en Node.js que funciona como una Pokedex interactiva y un simulador de combates Pokemon P2P en tiempo real.

## Caracteristicas Principales

* **Combates P2P en Tiempo Real:** Conexion directa entre jugadores utilizando WebRTC DataChannels, con un sistema de respaldo automatico a traves de Socket.io en caso de fallos de red.
* **Formatos de Combate:**
  * **Clasico:** Combates de 6 contra 6.
  * **Monopokemon:** Enfrentamientos rápidos de 1 contra 1.
  * **Monotipo:** Equipos completos de 6 Pokemon que deben compartir obligatoriamente al menos un tipo elemental en comun.
* **Personalizacion Completa de Equipos:**
  * **Edicion de Movimientos:** Seleccion libre de exactamente 4 movimientos extraidos del catálogo completo de PokeAPI para cada Pokemon en tiempo real.
  * **Habilidades y Objetos:** Seleccion de habilidades oficiales y objetos competitivos funcionales en combate (tales como Restos, Chaleco Asalto, Casco Dentado, Banda Focus, Cinta Experto, Lodo Negro, Hierba Blanca y bayas).
* **Megaevolucion:** Mecanica oficial integrada para Pokemon seleccionados (Venusaur, Blastoise, Charizard X/Y, Garchomp, Lucario, Gengar, Mewtwo X/Y, Gyarados y Gardevoir). Requiere equipar su respectiva Megapiedra (lo que ocupa la ranura de objeto del Pokemon) y permite activar la transformacion en batalla para actualizar estadisticas, tipos, habilidades y sprites.
* **Base de Datos Pokedex:** Vista detallada de cada especie con sus estadisticas base, habilidades, cadena evolutiva, debilidades elementales, reproduccion de sonido (cry) y listado completo de movimientos.
* **Huevo de Pascua (Easter Egg):** Se rumorea que hay una advertencia oculta en el pie de pagina de la Pokedex para los mas curiosos.

## Requisitos Previos

* Docker y Docker Compose instalados.
* O de forma alternativa, Node.js instalado localmente.

## Instalacion y Despliegue con Docker

Para compilar y levantar la aplicacion junto con el tunel de red publico para invitar a amigos, ejecuta el siguiente comando en la carpeta raiz del proyecto:

```bash
docker compose up --build
```

Una vez iniciado, la Pokedex estara disponible localmente en:
`http://localhost:3000`

## Instalacion Manual (Desarrollo Local)

Si prefieres ejecutar el servidor sin Docker, sigue estos pasos:

1. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

2. Inicia el servidor de señalizacion:
   ```bash
   node server.js
   ```

3. Accede a `http://localhost:3000` en tu navegador.
