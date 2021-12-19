FROM node:12.14-alpine

RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

USER node

COPY --chown=node:node . /home/node/app

WORKDIR /home/node/app
RUN npm install

#RUN chmod +x ./scripts/*.sh

#CMD ./scripts/start.sh


#FROM node:12
#WORKDIR /usr/src/app
#COPY package*.json ./
#
#RUN npm install
#COPY ../ .

CMD ["npm", "run", "build"]

CMD ["npm","run","typeorm:migration:run"]

CMD ["npm", "start"]
