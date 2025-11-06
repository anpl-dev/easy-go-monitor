FROM golang:1.24.6-alpine

WORKDIR /app

# Go module キャッシュ
COPY go.mod go.sum ./
RUN go mod download

# 残りをコピー
COPY . .

EXPOSE 8080

# コンテナ起動時コマンド
CMD ["go", "run", "./cmd/server/main.go"]