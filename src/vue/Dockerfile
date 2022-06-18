FROM node:14-alpine as develop-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
#RUN npm run serve

# этап сборки (build stage)
FROM develop-stage as build-stage
ENV API_URL "http://192.168.1.174:8086/api"
RUN npm run generate

# этап production (production-stage)
FROM nginx:stable-alpine as production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
