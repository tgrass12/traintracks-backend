CREATE TABLE IF NOT EXISTS journal_entry (
  id SERIAL PRIMARY KEY,
  user_id uuid NOT NULL,
  entry_date DATE NOT NULL,
  UNIQUE(user_id, entry_date),
  CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
