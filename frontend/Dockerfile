FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY .env.local .env.local
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
