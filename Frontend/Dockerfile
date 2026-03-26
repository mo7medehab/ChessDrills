FROM node:lts-bookworm-slim AS builder

ARG VITE_BACKEND_URL

ENV VITE_BACKEND_URL="http://localhost:3000"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine AS runner

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /var/www/html/

EXPOSE 5137
CMD ["nginx", "-g", "daemon off;"]