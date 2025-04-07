FROM node:alpine

ENV PORT 3000

WORKDIR /app

COPY package.json yarn.lock ./

# Production use node instead of root
# USER node

RUN yarn install

COPY . /app

RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]
