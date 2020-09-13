FROM node:lts
WORKDIR /app
COPY . .
COPY package.json .
RUN npm install typeorm -g
RUN yarn
RUN yarn build
EXPOSE 3333
ENTRYPOINT node ./dist/shared/infra/http/server.js


