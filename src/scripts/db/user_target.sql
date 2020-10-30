CREATE TABLE user_target (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  target_type varchar(20) NOT NULL,
  amount INT NOT NULL,
  target_info_id INT NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

ALTER TABLE user_target ADD UNIQUE(user_id, target_type, target_info_id);
