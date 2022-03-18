FROM node:12-alpine

# Create app directory
WORKDIR /home/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# uninstall the current bcrypt modules
RUN npm uninstall bcrypt

# install the bcrypt modules for the machine
RUN npm install bcrypt


COPY . /home/app

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/main"]