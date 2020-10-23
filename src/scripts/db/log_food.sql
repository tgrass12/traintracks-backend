CREATE TABLE IF NOT EXISTS log_food (
  id SERIAL PRIMARY KEY,
  log_meal_occasion_id INT NOT NULL,
  food_id INT NOT NULL,
  servings NUMERIC NOT NULL DEFAULT 0 CHECK (servings >= 0),
  CONSTRAINT fk_log_meal_occasion
    FOREIGN KEY(log_meal_occasion_id)
    REFERENCES log_meal_occasion(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_food
    FOREIGN KEY(food_id)
    REFERENCES food(id)
    ON DELETE CASCADE
);
