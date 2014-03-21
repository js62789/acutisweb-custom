SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `acutis` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `acutis` ;

-- -----------------------------------------------------
-- Table `acutis`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `acutis`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(50) NULL,
  `password` VARCHAR(32) NOT NULL,
  `username` VARCHAR(30) NOT NULL,
  `first_name` VARCHAR(50) NULL,
  `last_name` VARCHAR(50) NULL,
  `challenge` VARCHAR(32) NULL,
  `admin` TINYINT(1) NOT NULL DEFAULT FALSE,
  `active` TINYINT(1) NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `acutis`.`article`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `acutis`.`article` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(80) NULL,
  `author_id` INT NOT NULL,
  `content` TEXT NULL,
  `publish` TINYINT(1) NOT NULL DEFAULT FALSE,
  `active` TINYINT(1) NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_article_user_idx` (`author_id` ASC),
  CONSTRAINT `fk_article_user`
    FOREIGN KEY (`author_id`)
    REFERENCES `acutis`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `acutis`.`inquiry`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `acutis`.`inquiry` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(50) NULL,
  `name` VARCHAR(50) NULL,
  `phone` VARCHAR(50) NULL,
  `description` TEXT NULL,
  `read` TINYINT(1) NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
