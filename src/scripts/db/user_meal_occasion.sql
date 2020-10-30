CREATE TABLE user_meal_occasion (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  occasion_name varchar(15) NOT NULL,
  position INT NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  UNIQUE (user_id, occasion_name)
);
