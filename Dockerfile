FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl libssl3

COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "index.js"]