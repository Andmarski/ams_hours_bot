SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `ams_hours_bot` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ams_hours_bot`;

CREATE TABLE `logs` (
  `message_id` varchar(20) NOT NULL,
  `discord_id` varchar(20) DEFAULT NULL,
  `entry` varchar(21) DEFAULT NULL,
  `exit` varchar(21) DEFAULT NULL,
  `before` int(11) DEFAULT NULL,
  `after` int(11) DEFAULT NULL,
  `correction` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `logs` ADD PRIMARY KEY (`message_id`);

CREATE TABLE `on_duty` (
  `discord_id` varchar(20) NOT NULL,
  `first_zone` int(1) DEFAULT NULL,
  `second_zone` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `on_duty` ADD PRIMARY KEY (`discord_id`);

CREATE TABLE `users` (
  `discord_id` varchar(20) NOT NULL,
  `role_id` varchar(20) DEFAULT NULL,
  `thread_id` varchar(20) DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `users` ADD PRIMARY KEY (`discord_id`);

COMMIT;
