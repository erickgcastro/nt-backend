FROM node:18.12-bullseye-slim AS base

WORKDIR /app

COPY package*.json ./

FROM base AS development
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM base AS production

ENV NODE_ENV=production

RUN npm ci --only=production

COPY prisma ./prisma/

RUN npx prisma generate

COPY --from=development /app/dist ./dist
COPY --from=development /app/templates ./templates

EXPOSE 3000

CMD ["node", "dist/main"]

