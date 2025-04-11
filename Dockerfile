FROM node:14

COPY . .

CMD [ "node", "server.js"]