-- Sessions table (pour express-session)
CREATE TABLE IF NOT EXISTS sessions (
  sid varchar PRIMARY KEY,
  sess jsonb NOT NULL,
  expire timestamp NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(50),
  budget varchar(100),
  project_type varchar(100),
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(50) NOT NULL UNIQUE,
  color varchar(20) NOT NULL DEFAULT '#8B5CF6',
  created_at timestamp DEFAULT now()
);

-- Message-Tags join table
CREATE TABLE IF NOT EXISTS message_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  subject varchar(200) NOT NULL,
  content text NOT NULL,
  created_at timestamp DEFAULT now()
);

-- Page views analytics
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path varchar(255) NOT NULL,
  user_agent text,
  referrer text,
  created_at timestamp DEFAULT now()
);
