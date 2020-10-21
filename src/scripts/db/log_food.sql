CREATE TABLE IF NOT EXISTS log_food (
  id SERIAL PRIMARY KEY,
  log_meal_id SERIAL NOT NULL,
  food_id SERIAL NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  CONSTRAINT fk_log_meal
    FOREIGN KEY(log_meal_id)
    REFERENCES log_meal(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_food
    FOREIGN KEY(food_id)
    REFERENCES food(id)
    ON DELETE CASCADE
);
