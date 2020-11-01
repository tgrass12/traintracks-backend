CREATE TABLE IF NOT EXISTS nutrition_log (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL,
  water_intake INT NOT NULL DEFAULT 0,
  UNIQUE(user_id, entry_date),
  CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT water_intake_non_negative CHECK (water_intake >= 0)
);
