FROM node:lts-alpine

WORKDIR /usr/src/app

RUN npm install -g prisma

COPY package*.json ./

COPY wait-for.sh .

COPY ./prisma ./prisma
