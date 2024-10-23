FROM node:18.17-alpine
# 何を使うかSERVERによって何を使うのかを分ける

WORKDIR /usr/src/app
# node.js内のサーバーどこを見るか

RUN apk upgrade --no-cache && \
    apk add --update --no-cache \
    postgresql-client curl git
# 追加パッケージ