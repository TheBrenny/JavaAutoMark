-- Create Teacher Table
CREATE TABLE `teachers` (
  `zid` MEDIUMINT UNIQUE NOT NULL,
  `email` VARCHAR(320) NOT NULL,
  `fname` VARCHAR(25) NOT NULL,
  `lname` VARCHAR(25) NOT NULL,
  `password` CHAR(60) NOT NULL,
  PRIMARY KEY (`zid`)
);
INSERT INTO `teachers` (`zid`, `email`, `fname`, `lname`, `password`) VALUES
  (0, "admin@change-me.com", "admin", "admin", "$2b$12$qXsJqM7ZzGI9E3YTxm4wteqDc7A7dF8uJ0Lc8u0dBEoIPlzKFg6k6"); -- login with admin:admin

-- Create Course Table
CREATE TABLE `courses` (
  `uuid` INTEGER AUTO_INCREMENT UNIQUE,
  `course_id` CHAR(8) NOT NULL,
  `course_name` VARCHAR(100) NOT NULL,
  `running_year` SMALLINT NOT NULL,
  PRIMARY KEY (`course_id`, `running_year`)
);

-- Create Assignmnet Table
CREATE TABLE `assignments` (
  `assignment_id` INTEGER AUTO_INCREMENT UNIQUE,
  `assignment_name` VARCHAR(100) NOT NULL,
  `course_uuid` INTEGER NOT NULL,
  `code_location` VARCHAR(255) NOT NULL,
  `state` ENUM('none', 'processing', 'finished') NOT NULL DEFAULT 'none',
  PRIMARY KEY (`assignment_id`),
  FOREIGN KEY (`course_uuid`) REFERENCES `courses` (`uuid`)
);

-- Create Report Table 
CREATE TABLE `reports` (
  `id` INTEGER AUTO_INCREMENT UNIQUE,
  `zid` MEDIUMINT UNIQUE NOT NULL,
  `student_name` VARCHAR(50) NOT NULL,
  `report_location` VARCHAR(255) NOT NULL,
  `assignment_id` INTEGER NOT NULL,
  PRIMARY KEY (`zid`, `assignment_id`),
  FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`assignment_id`)
);
