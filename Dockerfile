FROM node:lts-alpine

COPY --chown=1000:1000 . /app

ENV NODE_ENV=production
WORKDIR /app
USER 1000:1000
RUN npm install --omit=dev

EXPOSE 3000

ENTRYPOINT ["node", "main.js"]
