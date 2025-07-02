FROM node:22.17-alpine AS build

ARG VITE_NEWSAPI_KEY
ARG VITE_GAURDIAN_KEY
ARG VITE_NYTIMES_KEY

ENV VITE_NEWSAPI_KEY=$VITE_NEWSAPI_KEY
ENV VITE_GAURDIAN_KEY=$VITE_GAURDIAN_KEY
ENV VITE_NYTIMES_KEY=$VITE_NYTIMES_KEY

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]