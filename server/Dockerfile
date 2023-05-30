FROM node:14-alpine
#chuẩn bị môi trường node.js, version node14/alpine

WORKDIR /optech/backend

COPY package*.json ./

RUN npm install

RUN npm install --save-dev @babel/core @babel/cli

RUN npm audit fix

COPY . .

RUN npm run build-src --force

CMD [ "npm","run", "build" ]

# docker build --tag node-docker .
# docker run -p 8080:8080 -d node-docker