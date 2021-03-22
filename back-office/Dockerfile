FROM node:lts

WORKDIR /src

ENV PATH /src/node_modules/.bin:$PATH

COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "start" ]