#yacoubou bassarou
# yacouboubassarou@gmail.com
# +229 01 97 60 26 57
# build environment
#16.14.0

# build environment
FROM node:18.20.2 AS builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY . /usr/src/app

# Copie de l'env prod vers env courant
COPY /src/environments/environment.preprod.ts /usr/src/app/src/environments/environment.ts

# Installation des dépendances
#RUN npm install --force
#
## Build Angular
#RUN npm run build --force
RUN npm install --legacy-peer-deps
RUN npm rebuild
RUN npm run build --force

# production environment
FROM nginx:1.13.9-alpine
RUN rm -rf /etc/nginx/conf.d
RUN mkdir -p /etc/nginx/conf.d
COPY ./default.conf /etc/nginx/conf.d/
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

