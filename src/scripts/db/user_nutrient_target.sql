CREATE TABLE IF NOT EXISTS user_nutrient_target (
  user_id uuid NOT NULL,
  nutrient_id INT NOT NULL,
  amount INT NOT NULL DEFAULT 0,
  PRIMARY KEY(user_id, nutrient_id),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_nutrient
    FOREIGN KEY (nutrient_id)
    REFERENCES nutrient_info(id)
    ON DELETE CASCADE
);
