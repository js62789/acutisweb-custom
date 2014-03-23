INSERT IGNORE INTO `acutis`.`user`
(
  `id`,
  `email`,
  `password`,
  `username`,
  `first_name`,
  `last_name`,
  `challenge`,
  `admin`
)
VALUES
(
  1,
  'js62789@gmail.com',
  SHA1(CONCAT('jsmith', '@UHw+C;|G1#_yJvrN%[VY5WNj/FpsKXXj=<bOu)a~g37$|L1nvw)b%CqLd4OV+*T')),
  'jsmith',
  'Jeffrey',
  'Smith',
  'JULY22006',
  1
);
