FROM node:12.18.1

WORKDIR /app

COPY . ./
RUN npm install
RUN npm run build

CMD [ "node", "./dist/graphql/server.js" ]