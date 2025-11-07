# Easy Go Monitor プロジェクト

Golang + React で構築された簡易モニタリングツールです。
Docker Compose による統合構成で、GitHub Codespaces 上でそのまま動作します。。

## クイックスタート（GitHub Codespaces）

このリポジトリは Codespaces 対応です。
ローカル環境を構築せず、ブラウザ上だけでアプリを起動できます。

### 1. Codespaces を起動

リポジトリページの右上にある
“<> Code” → “Codespaces” → “Create codespace on main”
をクリックします。

数分で開発環境が自動的に構築されます。

**無料枠について**
> GitHub Free アカウントでは、毎月 120 コア時間 / 15GB ストレージ まで無料です。  
> 作業後は Codespace を **Stop** または **Delete** して節約しましょう。

---

### 2. サービスが自動起動

Codespaces 起動後、コンテナが立ち上がります：

| サービス   | ポート | 内容                      |
| ---------- | ------ | ------------------------- |
| `postgres` | 55432  | DB(PostgreSQL 15)         |
| `pgadmin`  | 9080   | DB 管理 UI（Private）     |
| `backend`  | 8080   | Go (Gin) API サーバー     |
| `frontend` | 3000   | React + TypeScript (Vite) |

VSCode（またはブラウザ上）右下の「PORTS」パネルから、  
各ポートの URL を確認できます。

---

### 3. 公開ポートを設定

| サービス        | 推奨可視性  | 用途                       |
| --------------- | ----------- | -------------------------- |
| Frontend (3000) | **Public**  | React アプリにアクセス     |
| Backend (8080)  | **Public**  | API をフロントから呼び出す |
| pgAdmin (9080)  | **Private** | 外部からアクセス禁止       |

Ports タブで「3000」「8080」を右クリック → **Make Public** を選択。

---

### 4. アクセス URL の変更

Codespaces 環境では `localhost` ではなく、GitHub が発行する  
`https://<hash>-8080.app.github.dev` を利用します。

React の API ベース URL は  
`web/src/constants/api.ts` に定義されています。

例：

```ts
// web/src/constants/api.ts
export const API_BASE_URL = "http://localhost:8080"; // ← これを変更
```

設定が完了したら URL にアクセス

- React Frontend:
  `https://<hash>-3000.app.github.dev`
- Go Backend API:
  `https://<hash>-8080.app.github.dev/api/v1/health`
- pgAdmin (Private):
  `https://<hash>-9080.app.github.dev`

---

### 5. テストアカウントでログイン

初期データとして以下のユーザーが登録されています：

| 項目     | 値              |
| -------- | --------------- |
| Email    | `test@test.com` |
| Password | `test`          |

これでログインすると、モニタ一覧やランナー管理画面にアクセスできます。

---

### 6.　 Codespaces 環境の削除(クリーンアップ)

VS Code の左サイドバーで
「Codespaces」 → 対象環境を右クリック → Delete を選択。

もしくは

GitHub の右上にあるプロフィールアイコン → Your Codespaces をクリック
一覧から不要な Codespace の「…」メニューを開き、Delete を選択

または、対象リポジトリページの
「Code」 → 「Codespaces」タブ → 「Delete」ボタンからも削除できます。

### 7. ローカル開発

#### ER 図

![alt text](<easy go monitor.svg>)

---

#### データベースマイグレーション

このプロジェクトは [golang-migrate](https://github.com/golang-migrate/migrate) を使用して
PostgreSQL のマイグレーションを管理しています。

#### インストール

```bash
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

#### 新しいマイグレーションファイルの作成

```bash
migrate create -ext sql -dir db/migrations -seq easy-go-monitor-db
```

このコマンドで以下のようなファイルが生成されます:

```
db/migrations/
  0001_create_users_and_monitors.up.sql
  0001_create_users_and_monitors.down.sql
```

#### マイグレーションの適用

```bash
migrate -path db/migrations \
  -database "postgres://user:password@localhost:55432/monitor_db?sslmode=disable" up
```

#### マイグレーションのロールバック

直近の 1 つを戻す:

```bash
migrate -path db/migrations \
  -database "postgres://user:password@localhost:55432/monitor_db?sslmode=disable" down 1
```

すべて戻す:

```bash
migrate -path db/migrations \
  -database "postgres://user:password@localhost:55432/monitor_db?sslmode=disable" down
```

状態リセット

```bash
migrate -path db/migrations \
  -database "postgres://user:password@localhost:55432/monitor_db?sslmode=disable" drop -f
```

#### 確認

PostgreSQL にログインしてテーブルを確認:

```sql
\d users;
\d monitors;
```
