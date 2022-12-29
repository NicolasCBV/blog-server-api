FROM node:16.18.1 AS base

RUN mkdir -p /usr/app/
WORKDIR /usr/app/

# ---------- build stage -------------
FROM base AS builder

COPY package.json .
COPY babel.config.json .
COPY . .

RUN yarn install && yarn build && yarn install --production
RUN yarn prisma generate

# --------- release stage ------------
FROM base AS release

COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package.json .
RUN mkdir -p /usr/app/dist/public/uploads/users
RUN mkdir -p /usr/app/dist/public/uploads/posts

VOLUME ["/usr/app/node_modules"]
VOLUME ["/usr/app/dist"]

CMD ["yarn", "start"]

EXPOSE 3030