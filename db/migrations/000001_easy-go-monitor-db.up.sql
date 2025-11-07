CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS monitors (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    settings JSONB NOT NULL,
    is_enabled BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS runners (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    monitor_id UUID NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    interval_second INT NOT NULL,
    is_enabled BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS runner_histories (
    id UUID PRIMARY KEY,
    runner_id uuid NOT NULL REFERENCES runners(id) ON DELETE CASCADE,
    runner_name VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    message TEXT,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    response_time_ms INT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_monitors_user_id ON monitors(user_id);
CREATE INDEX idx_runners_user_id ON runners(user_id);
CREATE INDEX idx_runner_histories_runner_id ON runner_histories(runner_id);


-- Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---- Initial User ----
INSERT INTO users (id, name, email, password)
VALUES (
    gen_random_uuid(),
    'Test User',
    'test@test.com',
    '$2a$10$Xgor.aiKeqFPWXCj9ffu6OVzAjeiCbUgL3fwu5XvVsOqE1kw.fhZK'
)
ON CONFLICT DO NOTHING;
