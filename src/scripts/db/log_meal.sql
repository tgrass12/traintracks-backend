CREATE TABLE IF NOT EXISTS log_meal (
  id SERIAL PRIMARY KEY,
  meal_time_name varchar(30) NOT NULL,
  nutrition_log_id SERIAL NOT NULL,
  CONSTRAINT fk_nutrition_log
    FOREIGN KEY(nutrition_log_id)
    REFERENCES nutrition_log(id)
    ON DELETE CASCADE
);
