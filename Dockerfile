# Usamos una imagen oficial y ligera de Node.js
FROM node:20-alpine

# Establecemos el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install --only=production

# Copiamos el código fuente de la app (server.js y la carpeta public)
COPY . .

# El servidor de la app escucha en el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
