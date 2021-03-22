FROM node:lts

WORKDIR /src

ENV PATH /src/node_modules/.bin:$PATH

COPY package.json .

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN npm run build -- --prod --deploy-url /consenso/

ENTRYPOINT [ "node", "server.js" ]
