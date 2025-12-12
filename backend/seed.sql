-- =====================================================
-- Clean MySQL Script (Schema + Inserts)
-- =====================================================
DROP SCHEMA IF EXISTS mydb;
CREATE SCHEMA mydb DEFAULT CHARACTER SET utf8;
USE mydb;
SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS,
    UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS,
    FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE,
    SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
    NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
-- -----------------------------------------------------
-- Table: users
-- -----------------------------------------------------
CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `privilege` VARCHAR(45) NOT NULL,
    `password` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table: city
-- -----------------------------------------------------
CREATE TABLE `city` (
    `id` INT NOT NULL,
    `city` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table: rating
-- -----------------------------------------------------
CREATE TABLE `rating` (
    `id` INT NOT NULL,
    `rating` VARCHAR(45) NOT NULL,
    `users_id` INT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table: event
-- -----------------------------------------------------
CREATE TABLE `event` (
    `id` INT NOT NULL,
    `event_name` VARCHAR(45) NOT NULL,
    `description` VARCHAR(600) NOT NULL,
    `date` VARCHAR(45) NOT NULL,
    `city_id` INT NOT NULL,
    `rating_id` INT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
-- =====================================================
-- INSERT DATA
-- =====================================================
-- 1) Users
INSERT INTO users (name, privilege, password)
VALUES ('Jonas Kazlauskas', 'admin', 'pass123'),
    ('Agnė Petrauskaitė', 'user', 'pass123'),
    ('Mantas Žukauskas', 'user', 'pass123'),
    ('Eglė Vilkienė', 'user', 'pass123'),
    ('Tomas Grigaitis', 'user', 'pass123');
-- 2) Cities
INSERT INTO city (id, city)
VALUES (1, 'Vilnius'),
    (2, 'Kaunas'),
    (3, 'Klaipėda'),
    (4, 'Šiauliai'),
    (5, 'Panevėžys');
-- 3) Events
INSERT INTO event (
        id,
        event_name,
        description,
        date,
        city_id,
        rating_id
    )
VALUES (
        1,
        'Kaziuko mugė',
        'Tradicīnė mugė su amatininkais ir rankdarbiais.',
        '2026-03-06',
        1,
        1
    ),
    (
        2,
        'Joninių šventė',
        'Vasaros saulėgrįžos šventė su laužais ir koncertais.',
        '2026-06-23',
        2,
        6
    ),
    (
        3,
        'Vilniaus bienalė',
        'Šiuolaikinio meno renginys visame mieste.',
        '2026-09-11',
        1,
        11
    ),
    (
        4,
        'Klaipėdos jūros šventė',
        'Jūros tema, laivų paradai ir gatvės renginiai.',
        '2026-07-17',
        3,
        16
    ),
    (
        5,
        'Kauno kino festivalis',
        'Tarptautinis trumpų filmų festivalis.',
        '2026-11-05',
        2,
        21
    );
-- 4) Ratings (5 per event)
INSERT INTO rating (id, rating, users_id)
VALUES -- Event 1 (1–5)
    (1, '5', 1),
    (2, '4', 2),
    (3, '5', 3),
    (4, '3', 4),
    (5, '4', 5),
    -- Event 2 (6–10)
    (6, '4', 1),
    (7, '5', 2),
    (8, '4', 3),
    (9, '5', 4),
    (10, '5', 5),
    -- Event 3 (11–15)
    (11, '5', 1),
    (12, '5', 2),
    (13, '4', 3),
    (14, '4', 4),
    (15, '5', 5),
    -- Event 4 (16–20)
    (16, '4', 1),
    (17, '3', 2),
    (18, '4', 3),
    (19, '5', 4),
    (20, '4', 5),
    -- Event 5 (21–25)
    (21, '5', 1),
    (22, '5', 2),
    (23, '5', 3),
    (24, '4', 4),
    (25, '5', 5);
-- Restore settings
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;