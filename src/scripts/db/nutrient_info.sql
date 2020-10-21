CREATE TABLE IF NOT EXISTS nutrient_info (
  id SERIAL PRIMARY KEY,
  name varchar(30) NOT NULL UNIQUE,
  unit varchar(5) NOT NULL
);

INSERT INTO nutrient_info (name, unit) VALUES ('Energy', 'kCal');
INSERT INTO nutrient_info (name, unit) VALUES ('Total Carbohydrates', 'g');
INSERT INTO nutrient_info (name, unit) VALUES ('Total Fat', 'g');
INSERT INTO nutrient_info (name, unit) VALUES ('Protein', 'g');
INSERT INTO nutrient_info (name, unit) VALUES ('Fiber', 'g');
INSERT INTO nutrient_info (name, unit) VALUES ('Sugars', 'g');
INSERT INTO nutrient_info (name, unit) VALUES ('Trans Fat', 'g');
INSERT INTO nutrient_info (name, unit) VALUES ('Saturated Fat', 'g');
INSERT INTO nutrient_info (name, unit) VALUES ('Polyunsaturated Fat', 'g');
INSERT INTO nutrient_info (name, unit) VALUES ('Monounsaturated Fat', 'g');
INSERT INTO nutrient_info (name, unit) VALUES ('Sodium', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Cholesterol', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Calcium', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Iron', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Magnesium', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Potassium', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Zinc', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Phospohrus', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Vitamin A', 'mcg');
INSERT INTO nutrient_info (name, unit) VALUES ('Vitamin C', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Vitamin D', 'mcg');
INSERT INTO nutrient_info (name, unit) VALUES ('Vitamin E', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Vitamin K', 'mcg');
INSERT INTO nutrient_info (name, unit) VALUES ('Vitamin B5', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Vitamin B6', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Vitamin B12', 'mcg');
INSERT INTO nutrient_info (name, unit) VALUES ('Thiamin', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Riboflavin', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Niacin', 'mg');
INSERT INTO nutrient_info (name, unit) VALUES ('Biotin', 'mcg');
INSERT INTO nutrient_info (name, unit) VALUES ('Folate', 'mcg');
