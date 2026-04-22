FROM node:20-alpine

RUN npm install -g @nestjs/cli

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]