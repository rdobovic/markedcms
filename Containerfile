FROM docker.io/library/node:23-bookworm

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

# Default environment variable values
ENV PORT=5000
ENV NODE_ENV=production
ENV ORIGIN=http://localhost:5000

ENV AUTH_TOKEN_VALID_SEC=3600
ENV AUTH_TOKEN_REMEMBER_VALID_SEC=1209600
ENV POST_EXCERP_CHARACTERS=200

EXPOSE 5000

CMD [ "/app/build/index.js" ]