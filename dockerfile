FROM node:lts-alpine AS BUILDER

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run tsc

FROM node:lts-alpine

WORKDIR /usr/src/app

ENV NODE_ENV = production

RUN npm install -g prisma

COPY package*.json ./

RUN npm ci

COPY --from=BUILDER /usr/src/app/build ./build
COPY ./prisma ./prisma
COPY wait-for.sh .

RUN npx prisma generate

CMD [ "node", "./build/src/app.js" ]