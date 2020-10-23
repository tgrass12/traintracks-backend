CREATE TABLE IF NOT EXISTS users (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  username varchar(24) UNIQUE NOT NULL,
  email varchar(254) UNIQUE NOT NULL,
  password varchar(60) NOT NULL,
  first_name varchar(32),
  last_name varchar(32),
  CONSTRAINT username_min_length CHECK (char_length(username) > 2)
);
