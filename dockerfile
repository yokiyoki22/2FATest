FROM node AS BUILDER

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run tsc

FROM node

WORKDIR /usr/src/app

ENV NODE_ENV = production

RUN npm install -g prisma

COPY package*.json ./

RUN npm ci

COPY --from=BUILDER /usr/src/app/build ./build
COPY ./prisma ./prisma

RUN npx prisma generate

CMD [ "node", "./build/src/app.js" ]