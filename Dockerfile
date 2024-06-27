# Etapa de construcción del frontend
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

RUN echo 'npm install --legacy-peer-deps' > /start.sh
RUN echo 'node_modules/@angular/cli/bin/ng.js serve --host 0.0.0.0 --port 3001' >> /start.sh

CMD sh /start.sh
