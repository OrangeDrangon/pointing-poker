FROM node:13-alpine

EXPOSE 3000

WORKDIR /var/usr/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD [ "yarn", "start" ]
