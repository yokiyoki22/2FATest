FROM node:lts-alpine

WORKDIR /usr/src/app

RUN npm install -g prisma

COPY package*.json ./

RUN wget -O wait-for.sh https://github.com/eficode/wait-for/releases/download/v2.2.3/wait-for
RUN chmod +x wait-for.sh

COPY ./prisma ./prisma
