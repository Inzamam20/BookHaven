CREATE DEFINER=`root`@`localhost` FUNCTION `getRandomPerfumeID`() RETURNS varchar(10) CHARSET utf8mb4
    NO SQL
BEGIN
    DECLARE uniqueID VARCHAR(10);
    SET uniqueID = SUBSTRING(REPLACE(UNIX_TIMESTAMP(NOW()), '-', ''), 1, 10);
    RETURN uniqueID;
END

-- TRIGGER

CREATE DEFINER=`root`@`localhost` TRIGGER `perfume_BEFORE_INSERT` BEFORE INSERT ON `perfume` FOR EACH ROW BEGIN
	SET NEW.ID = getRandomPerfumeID();
END