FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY ./build .

EXPOSE 8080
CMD [ "node", "app.js" ]