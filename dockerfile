FROM node:alpine 

WORKDIR /usr/app/app

COPY package*.json ./
RUN yarn install

COPY . . 

EXPOSE 3000

CMD ["yarn", "dev"]