FROM node:19-alpine AS build
WORKDIR /app
COPY / ./
COPY package*.json ./

RUN npm install -g @angular/cli && \
    npm install && \
    ng build
COPY . .

FROM nginx:1.22.1-alpine
WORKDIR /app
COPY --from=build /app/dist/webapp /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template

#RUN export DOLLAR="$"

#envsubst < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'

