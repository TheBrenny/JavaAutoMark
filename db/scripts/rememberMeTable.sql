CREATE TABLE IF NOT EXISTS `rememberTokens` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `selector` CHAR(40) NOT NULL,
  `validator` CHAR(60) NOT NULL,
  `user` INTEGER NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user`) REFERENCES `users` (`id`)
);