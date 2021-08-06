CREATE TABLE `users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(40) NOT NULL,
  `password` CHAR(60) NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
);

-- %%%% Comes from the 'express-mysql-session' package %%%%
-- $$$$                                                $$$$
-- CREATE TABLE IF NOT EXISTS `sessions` (
--   `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
--   `expires` int(11) unsigned NOT NULL,
--   `data` mediumtext COLLATE utf8mb4_bin,
--   PRIMARY KEY (`session_id`)
-- ) ENGINE=InnoDB

-- %%%% Comes from /app/routes/rememberme.js %%%%
-- $$$$                                      $$$$
-- CREATE TABLE IF NOT EXISTS `rememberTokens` (
--   `id` INTEGER NOT NULL AUTO_INCREMENT,
--   `selector` CHAR(40) NOT NULL,
--   `validator` CHAR(60) NOT NULL,
--   `user` INTEGER NOT NULL,
--   PRIMARY KEY (`id`),
--   FOREIGN KEY (`user`) REFERENCES `users` (`id`)
-- );