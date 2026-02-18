# Stage 1 — Build (Node needed here)
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run generate


# Stage 2 — Production (NO Node.js here)
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/src/.output/public /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
