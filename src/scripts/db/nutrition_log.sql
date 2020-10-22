CREATE TABLE IF NOT EXISTS nutrition_log (
  id SERIAL PRIMARY KEY,
  journal_id SERIAL NOT NULL,
  water_consumed INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_journal
    FOREIGN KEY (journal_id)
    REFERENCES journal_entry(id)
    ON DELETE CASCADE,
  CONSTRAINT water_consumed_non_negative CHECK (water_consumed >= 0)
);
