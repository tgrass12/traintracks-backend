CREATE TABLE IF NOT EXISTS nutrition_log (
  id SERIAL PRIMARY KEY,
  journal_entry_id INT NOT NULL UNIQUE,
  water_intake INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_journal_entry
    FOREIGN KEY (journal_entry_id)
    REFERENCES journal_entry(id)
    ON DELETE CASCADE,
  CONSTRAINT water_intake_non_negative CHECK (water_intake >= 0)
);
