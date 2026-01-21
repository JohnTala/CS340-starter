
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(30) NOT NULL
);

CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(30) NOT NULL,
  inv_model VARCHAR(30) NOT NULL,
  inv_year CHAR(4) NOT NULL,
  inv_description TEXT NOT NULL,
  inv_image VARCHAR(255) NOT NULL,
  inv_thumbnail VARCHAR(255) NOT NULL,
  inv_price NUMERIC(10,2) NOT NULL,
  inv_miles INT NOT NULL,
  inv_color VARCHAR(20) NOT NULL,
  classification_id INT NOT NULL,
  CONSTRAINT fk_classification
    FOREIGN KEY (classification_id)
    REFERENCES classification(classification_id)
);

CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50) NOT NULL,
  account_lastname VARCHAR(50) NOT NULL,
  account_email VARCHAR(100) UNIQUE NOT NULL,
  account_password VARCHAR(255) NOT NULL,
  account_type VARCHAR(20) DEFAULT 'Client'
);

-- Tony Stark insert
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Tony Stark update
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Tony Stark delete
DELETE FROM account
WHERE account_id = 1;

-- GM Hummer description update
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
  AND inv_model = 'Hummer';

-- Select with join
SELECT i.inv_make,
       i.inv_model,
       c.classification_name
FROM inventory i
JOIN classification c
  ON i.classification_id = c.classification_id;

-- Image update
UPDATE inventory
SET inv_image = '/images/vehicles/no-image.png',
    inv_thumbnail = '/images/vehicles/no-image-tn.png'
WHERE inv_make = 'GM'
  AND inv_model = 'Hummer';
