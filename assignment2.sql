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
