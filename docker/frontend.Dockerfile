FROM node:20-alpine

WORKDIR /app

# パッケージインストール
COPY web/package*.json ./
RUN npm ci

# ソースコピー
COPY web ./

EXPOSE 3000

CMD ["npm", "run", "dev"]