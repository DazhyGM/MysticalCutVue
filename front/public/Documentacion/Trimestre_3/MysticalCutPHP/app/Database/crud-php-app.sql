-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-12-2024 a las 22:13:07
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `crud-php-app`
--
CREATE DATABASE IF NOT EXISTS `crud-php-app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `crud-php-app`;

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_role_module` (IN `idRole` INT)   BEGIN
SELECT ROL.role_name AS `role_fk`,MD.module_name AS `role_module`,MD.module_icon,MD.module_description, MD.module_route FROM role_module AS RM 
INNER JOIN role AS ROL ON RM.role_fk=ROL.role_id
INNER JOIN module AS MD ON RM.module_fk=MD.module_id
WHERE ROL.role_id=idRole;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_all` ()   BEGIN
SELECT `user_email`, `user_id`,`full_name`,`user_password`, UST.userStatus_name AS `userStatus_fk`, ROL.role_name AS `role_fk` FROM `user` AS US  
INNER JOIN role AS ROL ON US.role_fk=ROL.role_id
INNER JOIN userstatus AS UST  ON US.userStatus_fk=UST.userStatus_id
WHERE US.userStatus_fk=1
;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_all_paginated` (IN `offset` INT, IN `limit_rows` INT)   BEGIN
    SET @query = CONCAT('SELECT * FROM user LIMIT ', offset, ', ', limit_rows);
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_count` ()   BEGIN
    SELECT COUNT(*) AS total_users 
    FROM user;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_create` (IN `p_user_email` VARCHAR(100), IN `p_user_password` VARCHAR(255), IN `p_full_name` VARCHAR(100), IN `p_userStatus_fk` VARCHAR(20), IN `p_role_fk` INT)   BEGIN
-- Si no se pasa el estado, se asigna el valor predeterminado 'activo'
    IF p_userStatus_fk IS NULL THEN
        SET p_userStatus_fk = 1;
    END IF;
    -- Si no se pasa el rol, se asigna el valor predeterminado 1
    IF p_role_fk IS NULL THEN
        SET p_role_fk = 3;
    END IF;

    -- Inserta el nuevo usuario con los valores proporcionados o los predeterminados
    INSERT INTO user (
         user_email, user_password, full_name, userStatus_fk, role_fk 
    ) 
    VALUES (
        
        p_user_email, 
        p_user_password, 
        p_full_name, 
        p_userStatus_fk,    -- Estado (si es NULL, se asigna 'activo')
        p_role_fk  -- Rol (si es NULL, se asigna 1)
        
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_search` (IN `dataSearch` VARCHAR(60))   BEGIN
SELECT `user_id`,`user_email`,`user_password`, UST.userStatus_name AS `userStatus_fk`, ROL.role_name AS `role_fk` FROM `user` AS US  
INNER JOIN role AS ROL ON US.role_fk=ROL.role_id
INNER JOIN userstatus AS UST  ON US.userStatus_fk=UST.userStatus_id 
WHERE ROL.role_name=dataSearch OR UST.userStatus_name=dataSearch OR US.user_email=dataSearch;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `category_product`
--

CREATE TABLE IF NOT EXISTS `category_product` (
  `id_category` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `category_product`:
--

--
-- Truncar tablas antes de insertar `category_product`
--

TRUNCATE TABLE `category_product`;
--
-- Volcado de datos para la tabla `category_product`
--

INSERT INTO `category_product` (`id_category`, `name`) VALUES
(1, 'Cortes de Cabello'),
(2, 'Afeitado'),
(3, 'Tintes y Coloración'),
(4, 'Tratamientos Capilares'),
(5, 'Productos de Estilo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `category_services`
--

CREATE TABLE IF NOT EXISTS `category_services` (
  `id_category_services` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_category_services`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `category_services`:
--

--
-- Truncar tablas antes de insertar `category_services`
--

TRUNCATE TABLE `category_services`;
--
-- Volcado de datos para la tabla `category_services`
--

INSERT INTO `category_services` (`id_category_services`, `name`) VALUES
(1, 'Cortes de Cabello'),
(2, 'Afeitado y Barba'),
(3, 'Coloración y Tintes'),
(4, 'Tratamientos Capilares'),
(5, 'Servicios para Niños');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `document_type`
--

CREATE TABLE IF NOT EXISTS `document_type` (
  `id_doctypes` int(11) NOT NULL AUTO_INCREMENT,
  `doctype_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_doctypes`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `document_type`:
--

--
-- Truncar tablas antes de insertar `document_type`
--

TRUNCATE TABLE `document_type`;
--
-- Volcado de datos para la tabla `document_type`
--

INSERT INTO `document_type` (`id_doctypes`, `doctype_name`) VALUES
(1, 'Cedula de ciudadania'),
(2, 'Tarjeta de identidad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facture`
--

CREATE TABLE IF NOT EXISTS `facture` (
  `id_facture` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `total_value` float NOT NULL,
  `user_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_facture`),
  KEY `fk_factura_usuario` (`user_fk`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `facture`:
--   `user_fk`
--       `user` -> `user_id`
--

--
-- Truncar tablas antes de insertar `facture`
--

TRUNCATE TABLE `facture`;
--
-- Volcado de datos para la tabla `facture`
--

INSERT INTO `facture` (`id_facture`, `date`, `total_value`, `user_fk`) VALUES
(1, '2024-12-03', 150.75, 1),
(2, '2024-12-03', 180.75, 1),
(3, '2024-12-03', 160.75, 1),
(4, '2024-12-04', 250, 1),
(5, '2024-12-04', 350, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `module`
--

CREATE TABLE IF NOT EXISTS `module` (
  `module_id` int(11) NOT NULL AUTO_INCREMENT,
  `module_name` varchar(20) NOT NULL,
  `module_route` varchar(20) NOT NULL,
  `module_icon` varchar(40) NOT NULL,
  `module_description` varchar(200) NOT NULL,
  PRIMARY KEY (`module_id`),
  UNIQUE KEY `module_name` (`module_name`),
  UNIQUE KEY `module_route` (`module_route`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `module`:
--

--
-- Truncar tablas antes de insertar `module`
--

TRUNCATE TABLE `module`;
--
-- Volcado de datos para la tabla `module`
--

INSERT INTO `module` (`module_id`, `module_name`, `module_route`, `module_icon`, `module_description`) VALUES
(1, 'Home', 'home/home', '<i class=\"bi bi-house-fill\"></i>', 'This is module home'),
(2, 'User', 'user/index', '<i class=\"bi bi-person-badge-fill\"></i>', 'This is module user'),
(3, 'Servicio', 'services/index', '<i class=\"bi bi-clipboard-check\"></i>', 'This is module facture');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--

CREATE TABLE IF NOT EXISTS `product` (
  `id_product` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` float NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `id_category` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_product`),
  KEY `fk_categoria` (`id_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `product`:
--   `id_category`
--       `category_product` -> `id_category`
--

--
-- Truncar tablas antes de insertar `product`
--

TRUNCATE TABLE `product`;
--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`id_product`, `name`, `price`, `description`, `amount`, `id_category`) VALUES
(1, 'Corte Clásico', 15, 'Corte de cabello tradicional', 10, 1),
(2, 'Afeitado Tradicional', 10, 'Afeitado con navaja y toalla caliente', 15, 2),
(3, 'Tinte para Cabello', 30, 'Tinte permanente para cabello', 5, 3),
(4, 'Tratamiento de Keratina', 50, 'Hidratación profunda con keratina', 3, 4),
(5, 'Pomada para el Cabello', 12, 'Pomada con fijación media para peinado', 20, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_invoice_detail`
--

CREATE TABLE IF NOT EXISTS `product_invoice_detail` (
  `amount` int(11) NOT NULL,
  `price` float DEFAULT NULL,
  `id_facture` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  KEY `fk_product_invoice_detail` (`id_facture`),
  KEY `fk_detail_invoice_product_product` (`id_product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `product_invoice_detail`:
--   `id_product`
--       `product` -> `id_product`
--   `id_facture`
--       `facture` -> `id_facture`
--

--
-- Truncar tablas antes de insertar `product_invoice_detail`
--

TRUNCATE TABLE `product_invoice_detail`;
--
-- Volcado de datos para la tabla `product_invoice_detail`
--

INSERT INTO `product_invoice_detail` (`amount`, `price`, `id_facture`, `id_product`) VALUES
(2, 30, 1, 1),
(1, 20, 2, 2),
(3, 36, 3, 3),
(1, 18, 4, 4),
(2, 100, 5, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `quotes`
--

CREATE TABLE IF NOT EXISTS `quotes` (
  `id_quotes` int(11) NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `state_quotes` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_quotes`),
  KEY `fk_appointment_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `quotes`:
--   `user_id`
--       `user` -> `user_id`
--

--
-- Truncar tablas antes de insertar `quotes`
--

TRUNCATE TABLE `quotes`;
--
-- Volcado de datos para la tabla `quotes`
--

INSERT INTO `quotes` (`id_quotes`, `date_time`, `end_time`, `state_quotes`, `user_id`) VALUES
(1, '2024-12-03 10:00:00', '2024-12-03 10:30:00', 'Confirmada', 1),
(2, '2024-12-03 11:00:00', '2024-12-03 11:45:00', 'Pendiente', 2),
(3, '2024-12-03 14:00:00', '2024-12-03 14:30:00', 'Cancelada', 3),
(4, '2024-12-04 09:30:00', '2024-12-04 10:00:00', 'Confirmada', 4),
(5, '2024-12-04 15:00:00', '2024-12-04 15:30:00', 'Confirmada', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(20) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `role`:
--

--
-- Truncar tablas antes de insertar `role`
--

TRUNCATE TABLE `role`;
--
-- Volcado de datos para la tabla `role`
--

INSERT INTO `role` (`role_id`, `role_name`) VALUES
(1, 'Admin'),
(3, 'Client'),
(2, 'Employee');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_module`
--

CREATE TABLE IF NOT EXISTS `role_module` (
  `roleModule_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_fk` int(11) NOT NULL,
  `module_fk` int(11) NOT NULL,
  PRIMARY KEY (`roleModule_id`),
  KEY `role_module_role` (`role_fk`),
  KEY `role_module_module` (`module_fk`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `role_module`:
--   `module_fk`
--       `module` -> `module_id`
--   `role_fk`
--       `role` -> `role_id`
--

--
-- Truncar tablas antes de insertar `role_module`
--

TRUNCATE TABLE `role_module`;
--
-- Volcado de datos para la tabla `role_module`
--

INSERT INTO `role_module` (`roleModule_id`, `role_fk`, `module_fk`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(4, 3, 1),
(5, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `services`
--

CREATE TABLE IF NOT EXISTS `services` (
  `id_services` int(11) NOT NULL,
  `name_service` varchar(20) DEFAULT NULL,
  `estimated_time` time DEFAULT NULL,
  `price` float DEFAULT NULL,
  `id_category_services` int(11) NOT NULL,
  PRIMARY KEY (`id_services`),
  KEY `fk_categoria_Servicios` (`id_category_services`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `services`:
--   `id_category_services`
--       `category_services` -> `id_category_services`
--

--
-- Truncar tablas antes de insertar `services`
--

TRUNCATE TABLE `services`;
--
-- Volcado de datos para la tabla `services`
--

INSERT INTO `services` (`id_services`, `name_service`, `estimated_time`, `price`, `id_category_services`) VALUES
(1, 'Corte Clásico', '00:30:00', 15, 1),
(2, 'Afeitado Tradicional', '00:20:00', 10, 2),
(3, 'Tinte Capilar', '01:00:00', 40, 3),
(4, 'Tratamiento Hidratan', '00:45:00', 25, 4),
(5, 'Corte Infantil', '00:25:00', 12, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `service_invoice_detail`
--

CREATE TABLE IF NOT EXISTS `service_invoice_detail` (
  `amount` int(11) NOT NULL,
  `price` float DEFAULT NULL,
  `id_facture` int(11) NOT NULL,
  `id_services` int(11) NOT NULL,
  KEY `fk_service_invoice_detail` (`id_facture`),
  KEY `fk_detail_invoice_service_service` (`id_services`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `service_invoice_detail`:
--   `id_services`
--       `services` -> `id_services`
--   `id_facture`
--       `facture` -> `id_facture`
--

--
-- Truncar tablas antes de insertar `service_invoice_detail`
--

TRUNCATE TABLE `service_invoice_detail`;
--
-- Volcado de datos para la tabla `service_invoice_detail`
--

INSERT INTO `service_invoice_detail` (`amount`, `price`, `id_facture`, `id_services`) VALUES
(1, 15, 1, 1),
(1, 10, 2, 2),
(2, 80, 3, 3),
(1, 25, 4, 4),
(3, 36, 5, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `type_of_quotes`
--

CREATE TABLE IF NOT EXISTS `type_of_quotes` (
  `id_quotes` int(11) NOT NULL,
  `id_services` int(11) NOT NULL,
  `barber` int(11) DEFAULT NULL,
  KEY `fk_type_citation_citation` (`id_quotes`),
  KEY `fk_type_appointment_service` (`id_services`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `type_of_quotes`:
--   `id_services`
--       `services` -> `id_services`
--   `id_quotes`
--       `quotes` -> `id_quotes`
--

--
-- Truncar tablas antes de insertar `type_of_quotes`
--

TRUNCATE TABLE `type_of_quotes`;
--
-- Volcado de datos para la tabla `type_of_quotes`
--

INSERT INTO `type_of_quotes` (`id_quotes`, `id_services`, `barber`) VALUES
(1, 1, 101),
(2, 2, 102),
(3, 3, 103),
(4, 4, 104),
(5, 5, 105);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(30) NOT NULL,
  `user_password` varchar(256) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `userStatus_fk` int(11) NOT NULL,
  `role_fk` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`),
  KEY `user_role` (`role_fk`),
  KEY `user_status` (`userStatus_fk`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `user`:
--   `role_fk`
--       `role` -> `role_id`
--   `userStatus_fk`
--       `userstatus` -> `userStatus_id`
--

--
-- Truncar tablas antes de insertar `user`
--

TRUNCATE TABLE `user`;
--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`user_id`, `user_email`, `user_password`, `full_name`, `userStatus_fk`, `role_fk`) VALUES
(1, 'kevinsabogal24@gmail.com', '$2y$10$zNXemXVFPEbCd7yFTM.rMe3FO2sTze.cW/cOrGTps0dOi1YyFO7nW', 'Kevin David Sabogal', 1, 1),
(2, 'andresecasvar05@gmail.com', '$2y$10$zNXemXVFPEbCd7yFTM.rMe3FO2sTze.cW/cOrGTps0dOi1YyFO7nW', 'Andres Esteban Castañeda', 1, 3),
(3, 'leonoscarandres04@gmail.com', '$2y$10$qzDqu59/2GzX4SEQ73AkWey5kwBLOQRlQ0wS8YI/t5nlr6aQecaMu', 'Oscar Andres Leon', 1, 2),
(4, 'hharold855@gmail.com', '$2y$10$apbVkvl8vulCNI1eNSvDUOaQlOSCDg3NrHHV6elR7d5uCAsszt2Tq', 'Harold David Hernandez', 1, 2),
(5, 'prueba@gmail.com', '$2y$10$OCw6UzozG1/WR9K6RxFp6O9TfuBT5Luiub/tj2.T3rcPHpgJ1gvA2', 'Administrador', 3, 1),
(53, 'sandramcipe.07@hotmail.com', '$2y$10$vK.5hwK/Ayj1YP.YU9Uyaezt8Rs8RdkWTBzTY0HVbij7Hp9txlyUe', 'Sandra Mancipe', 1, 3),
(55, 'diegoc@gmail.com', '$2y$10$Kv15g8qw66pY4uLWCcR9GuD6RPXqrA1.s8oP9ACWGK8jtWjslzliq', 'Diego Sena', 1, 3),
(56, 'user58@email.com', '$2y$10$TfUZIrsaq5metTZD2kEQ/OYwRe2bs0cXzzhShrIDFxDJ6eWYl5WUm', 'user prueba', 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `userstatus`
--

CREATE TABLE IF NOT EXISTS `userstatus` (
  `userStatus_id` int(11) NOT NULL AUTO_INCREMENT,
  `userStatus_name` varchar(20) NOT NULL,
  PRIMARY KEY (`userStatus_id`),
  UNIQUE KEY `userStatus_name` (`userStatus_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `userstatus`:
--

--
-- Truncar tablas antes de insertar `userstatus`
--

TRUNCATE TABLE `userstatus`;
--
-- Volcado de datos para la tabla `userstatus`
--

INSERT INTO `userstatus` (`userStatus_id`, `userStatus_name`) VALUES
(1, 'Active'),
(3, 'Blocked'),
(2, 'Inactive');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `facture`
--
ALTER TABLE `facture`
  ADD CONSTRAINT `fk_factura_usuario` FOREIGN KEY (`user_fk`) REFERENCES `user` (`user_id`);

--
-- Filtros para la tabla `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `fk_categoria` FOREIGN KEY (`id_category`) REFERENCES `category_product` (`id_category`);

--
-- Filtros para la tabla `product_invoice_detail`
--
ALTER TABLE `product_invoice_detail`
  ADD CONSTRAINT `fk_detail_invoice_product_product` FOREIGN KEY (`id_product`) REFERENCES `product` (`id_product`),
  ADD CONSTRAINT `fk_product_invoice_detail` FOREIGN KEY (`id_facture`) REFERENCES `facture` (`id_facture`);

--
-- Filtros para la tabla `quotes`
--
ALTER TABLE `quotes`
  ADD CONSTRAINT `fk_appointment_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Filtros para la tabla `role_module`
--
ALTER TABLE `role_module`
  ADD CONSTRAINT `role_module_module` FOREIGN KEY (`module_fk`) REFERENCES `module` (`module_id`),
  ADD CONSTRAINT `role_module_role` FOREIGN KEY (`role_fk`) REFERENCES `role` (`role_id`);

--
-- Filtros para la tabla `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `fk_categoria_Servicios` FOREIGN KEY (`id_category_services`) REFERENCES `category_services` (`id_category_services`);

--
-- Filtros para la tabla `service_invoice_detail`
--
ALTER TABLE `service_invoice_detail`
  ADD CONSTRAINT `fk_detail_invoice_service_service` FOREIGN KEY (`id_services`) REFERENCES `services` (`id_services`),
  ADD CONSTRAINT `fk_service_invoice_detail` FOREIGN KEY (`id_facture`) REFERENCES `facture` (`id_facture`);

--
-- Filtros para la tabla `type_of_quotes`
--
ALTER TABLE `type_of_quotes`
  ADD CONSTRAINT `fk_type_appointment_service` FOREIGN KEY (`id_services`) REFERENCES `services` (`id_services`),
  ADD CONSTRAINT `fk_type_citation_citation` FOREIGN KEY (`id_quotes`) REFERENCES `quotes` (`id_quotes`);

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_role` FOREIGN KEY (`role_fk`) REFERENCES `role` (`role_id`),
  ADD CONSTRAINT `user_status` FOREIGN KEY (`userStatus_fk`) REFERENCES `userstatus` (`userStatus_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
