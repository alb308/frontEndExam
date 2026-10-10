# Immagine Docker del sito: build del frontend, poi un solo server Node che serve pagine e API.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3001 DATA_DIR=/data
RUN mkdir -p /data && chown node:node /data
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json db.json ./
COPY server ./server
USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3001/api/auth/me || exit 1
CMD ["node", "--disable-warning=ExperimentalWarning", "server/index.js"]
