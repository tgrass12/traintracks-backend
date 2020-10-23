CREATE TABLE IF NOT EXISTS log_meal_occasion (
  id SERIAL PRIMARY KEY,
  occasion_name varchar(30) NOT NULL,
  nutrition_log_id INT NOT NULL,
  CONSTRAINT fk_nutrition_log
    FOREIGN KEY(nutrition_log_id)
    REFERENCES nutrition_log(id)
    ON DELETE CASCADE
);
