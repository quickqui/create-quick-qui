FROM tarampampam/node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -qy

COPY . .

RUN ./node_modules/.bin/tsc

CMD sh ./cpToDir.sh

