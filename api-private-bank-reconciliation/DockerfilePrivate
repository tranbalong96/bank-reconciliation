FROM node:12-alpine

# Create app directory
WORKDIR /home/app

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY . /home/app

RUN npm run build

EXPOSE 3001

CMD [ "node", "dist/main"]