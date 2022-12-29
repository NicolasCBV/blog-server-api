FROM node:16.18.1

RUN mkdir -p /usr/app/
WORKDIR /usr/app

COPY package*.json /usr/app
COPY . /usr/app

run yarn install && yarn build && yarn prisma generate

VOLUME ["/usr/app/node_modules"]
VOLUME ["/usr/app/public/uploads"]

EXPOSE 3030