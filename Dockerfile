# Etapa de construcción del frontend
FROM node:20-alpine AS build-frontendcreadores

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración del proyecto Angular
COPY package*.json /app/
COPY angular.json /app/
COPY tsconfig.json /app/
COPY tsconfig.app.json /app/
COPY tsconfig.spec.json /app/


# Instalar las dependencias
RUN npm install --legacy-peer-deps

# Copiar el código fuente del proyecto Angular
COPY src /app/src

# Construir el proyecto Angular
RUN npm run build

# Etapa de servidor HTTP para servir el frontend
FROM httpd:2.4 AS serve-frontendcreadores

# Copiar los archivos construidos al servidor HTTP
COPY --from=build-frontendcreadores /app/dist/frontend-creadores /usr/local/apache2/htdocs/

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar el servidor HTTP
CMD ["httpd-foreground"]

