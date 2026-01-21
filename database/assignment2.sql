
-- BUILD DATABASE SCRIPT 

DROP TYPE IF EXISTS public.account_type CASCADE;

CREATE TYPE public.account_type AS ENUM
  ('Client', 'Employee', 'Admin');

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
  inv_price NUMERIC(9,0) NOT NULL,
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
  account_type account_type NOT NULL DEFAULT 'Client'
);


-- INSERT BASE DATA 

INSERT INTO classification (classification_name)
VALUES ('Custom'), ('Sport'), ('SUV'), ('Truck'), ('Sedan');

INSERT INTO inventory (
  inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_miles,
  inv_color, classification_id
)
VALUES (
  'GM',
  'Hummer',
  '2016',
  'Do you have 6 kids and like to go offroading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.',
  '/images/hummer.jpg',
  '/images/hummer-tn.jpg',
  58800,
  56564,
  'Yellow',
  4
);


--  QUERIES 

-- Tony Stark insert
INSERT INTO account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
)
VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);

-- Tony Stark update
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Tony Stark delete
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

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
