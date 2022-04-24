# Naively Simple Node Dockerfile

FROM node:14.17-alpine

RUN mkdir -p /home/app/ && chown -R node:node /home/app
WORKDIR /home/app
COPY --chown=node:node . .

USER node

RUN npm install
RUN npm run build

EXPOSE 3000
CMD [ "yarn", "start" ]


