FROM node:20-alpine 
WORKDIR /app

RUN apk add --no-cache wget

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
RUN npm run build

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["sh", "-c", "PORT=3000 HOSTNAME=0.0.0.0 npm run start"]
