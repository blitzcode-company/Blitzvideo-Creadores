FROM node:20-alpine AS build-frontendcreadores

WORKDIR /app

COPY package*.json /app/
RUN npm install --legacy-peer-deps

RUN npm run build

FROM httpd:2.4 AS serve-frontendcreadores

COPY --from=build-frontendcreadores /app/dist/frontend-creadores/browser /usr/local/apache2/htdocs/

EXPOSE 80

CMD ["httpd-foreground"]

