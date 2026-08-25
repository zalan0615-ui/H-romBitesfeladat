-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Aug 25. 13:05
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `csapatomcucataskmanagaer`
--

DELIMITER $$
--
-- Eljárások
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_tag_to_task` (IN `p_task_id` INT, IN `p_tag_id` INT)   BEGIN
    INSERT INTO task_tags (task_id, tag_id) VALUES (p_task_id, p_tag_id);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_tag` (IN `p_name` VARCHAR(50))   BEGIN
    INSERT INTO tags (name) VALUES (p_name);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_task` (IN `p_title` VARCHAR(150), IN `p_description` TEXT, IN `p_status` VARCHAR(20), IN `p_due_date` DATE, IN `p_user_id` INT)   BEGIN
    INSERT INTO tasks (title, description, status, due_date, user_id)
    VALUES (p_title, p_description, COALESCE(p_status, 'TODO'), p_due_date, p_user_id);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_user` (IN `p_username` VARCHAR(50), IN `p_email` VARCHAR(100), IN `p_password` VARCHAR(255))   BEGIN
    INSERT INTO users (username, email, password)
    VALUES (p_username, p_email, p_password);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_task` (IN `p_id` INT)   BEGIN
    DELETE FROM tasks WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_user` (IN `p_id` INT)   BEGIN
    DELETE FROM users WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_tags` ()   BEGIN
    SELECT id, name FROM tags;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_tasks` ()   BEGIN
    SELECT t.*, u.username 
    FROM tasks t
    LEFT JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_users` ()   BEGIN
    SELECT id, username, email FROM users;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_tags_for_task` (IN `p_task_id` INT)   BEGIN
    SELECT t.id, t.name 
    FROM tags t
    JOIN task_tags tt ON t.id = tt.tag_id
    WHERE tt.task_id = p_task_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_tasks_by_user` (IN `p_user_id` INT)   BEGIN
    SELECT * FROM tasks WHERE user_id = p_user_id ORDER BY created_at DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_task_by_id` (IN `p_id` INT)   BEGIN
    SELECT * FROM tasks WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_user_by_email` (IN `p_email` VARCHAR(100))   BEGIN
    SELECT id, username, email, password FROM users WHERE email = p_email;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_user_by_id` (IN `p_id` INT)   BEGIN
    SELECT id, username, email FROM users WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_remove_tag_from_task` (IN `p_task_id` INT, IN `p_tag_id` INT)   BEGIN
    DELETE FROM task_tags WHERE task_id = p_task_id AND tag_id = p_tag_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_task` (IN `p_id` INT, IN `p_title` VARCHAR(150), IN `p_description` TEXT, IN `p_status` VARCHAR(20), IN `p_due_date` DATE)   BEGIN
    UPDATE tasks 
    SET title = p_title,
        description = p_description,
        status = p_status,
        due_date = p_due_date
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_user` (IN `p_id` INT, IN `p_username` VARCHAR(50), IN `p_email` VARCHAR(100), IN `p_password` VARCHAR(255))   BEGIN
    UPDATE users 
    SET username = p_username,
        email = p_email,
        password = p_password
    WHERE id = p_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `due_date` date DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `task_tags`
--

CREATE TABLE `task_tags` (
  `task_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
