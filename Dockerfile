FROM node:22.5.1-alpine3.19
WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --immutable

COPY . .
RUN yarn build

ENTRYPOINT [ "yarn", "node", "./dist/index.js" ]
