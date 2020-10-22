CREATE TABLE IF NOT EXISTS nutrition_log_nutrient_target (
  nutrition_log_id SERIAL NOT NULL,
  nutrient_id SERIAL NOT NULL,
  amount INT NOT NULL DEFAULT 0,
  PRIMARY KEY(nutrition_log_id, nutrient_id),
  CONSTRAINT fk_nutrition_log
    FOREIGN KEY (nutrition_log_id)
    REFERENCES nutrition_log(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_nutrient
    FOREIGN KEY (nutrient_id)
    REFERENCES nutrient_info(id)
    ON DELETE CASCADE
);
