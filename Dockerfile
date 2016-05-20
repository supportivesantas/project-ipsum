FROM node:5
MAINTAINER Roland Fung

# Create app directory
RUN mkdir -p /usr/src/djdeploy
WORKDIR /usr/src/djdeploy

# Install app dependencies
COPY package.json /usr/src/djdeploy/
RUN npm install

# Bundle app source
COPY . /usr/src/djdeploy

EXPOSE 1337
