# build environment
#16.14.0
FROM node:18.17.1  as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY . /usr/src/app
#RUN npm install -g npm
RUN npm install --force
#RUN npm install -g  @angular/cli

#RUN ng build
RUN npm run build
#RUN npm install --production

#RUN npm install

#RUN npm install -g  @angular/cli

#RUN ng build
#RUN npm run build:prod

##RUN npm start -- --port 80
#EXPOSE 80
#CMD ["npm", "start"]
#RUN npm run build --prod
#RUN NODE_ENV=production  npm run build

#RUN npm run build:prod
EXPOSE 80

## production environment
FROM nginx:1.13.9-alpine
RUN rm -rf /etc/nginx/conf.d
RUN mkdir -p /etc/nginx/conf.d
COPY ./default.conf /etc/nginx/conf.d/
COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


#FROM node:16-alpine AS build
#WORKDIR /app
#COPY package*.json ./
#RUN npm install --force
#
#COPY . .
#RUN npm run build
#EXPOSE 4200
#CMD ["npm", "start"]


#FROM nginx:1.13.9-alpine
#RUN rm -rf /etc/nginx/conf.d
#RUN mkdir -p /etc/nginx/conf.d
#COPY ./default.conf /etc/nginx/conf.d/
#COPY ./dist/ /usr/share/nginx/html
#
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

#
#FROM node:16-alpine AS build
#WORKDIR /app
#
#COPY . .
#RUN npm install
#RUN npm run build
## Serve Application using Nginx Server
#FROM nginx:alpine
#COPY --from=build /app/dist/ /usr/share/nginx/html
#EXPOSE 80



#
##stage 1
#FROM node:latest as node
#WORKDIR /app
#COPY ./ /app
#RUN npm update
#RUN npm run build --prod
#
#
##stage 2
##FROM nginx:alpine
#FROM nginx:1.13.9-alpine
#RUN rm -rf /etc/nginx/conf.d
#RUN mkdir -p /etc/nginx/conf.d
#COPY ./default.conf /etc/nginx/conf.d/
#COPY --from=node /app/dist/ /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
#


#FROM nginx:1.13.9-alpine
#RUN rm -rf /etc/nginx/conf.d
#RUN mkdir -p /etc/nginx/conf.d
#COPY ./default.conf /etc/nginx/conf.d/
#COPY ./dist/ /usr/share/nginx/html
#
#
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

## build environment
#FROM node:16.13.1 as builder
##FROM node:9.6.1 as builder
#RUN mkdir /usr/src/app
#WORKDIR /usr/src/app
#ENV PATH /usr/src/app/node_modules/.bin:$PATH
#COPY . /usr/src/app
##RUN npm install
##RUN npm install -g  @angular/cli
##
#RUN ng build
#RUN npm run build:prod

# production environment
#FROM nginx:1.13.9-alpine
#RUN rm -rf /etc/nginx/conf.d
#RUN mkdir -p /etc/nginx/conf.d
#COPY ./default.conf /etc/nginx/conf.d/
#COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html
#COPY --from=builder /usr/src/app/dist2/ /usr/share/nginx/html/admin
#
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
