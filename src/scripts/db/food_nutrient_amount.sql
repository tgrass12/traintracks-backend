CREATE TABLE IF NOT EXISTS food_nutrient_amount (
  food_id INT NOT NULL,
  nutrient_info_id INT NOT NULL,
  amount INT NOT NULL DEFAULT 0 CHECK (amount >= 0),
  CONSTRAINT fk_food
    FOREIGN KEY (food_id)
    REFERENCES food(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_nutrient_info
    FOREIGN KEY(nutrient_info_id)
    REFERENCES nutrient_info(id)
    ON DELETE CASCADE,
  PRIMARY KEY(food_id, nutrient_info_id)
);
