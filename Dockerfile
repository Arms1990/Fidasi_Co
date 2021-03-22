FROM node:lts

RUN apt-get update && apt-get install -y graphicsmagick

WORKDIR /src

COPY ./services/package.json .

RUN npm install

RUN npm install pm2 knex -g

COPY . .

ENTRYPOINT [ "pm2-runtime", "start", "services.config.js" ]
