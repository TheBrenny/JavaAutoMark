-- Create Teacher Table
CREATE TABLE `teachers` (
  `zid` MEDIUMINT UNIQUE NOT NULL,
  `email` VARCHAR(320) NOT NULL,
  `fname` VARCHAR(25) NOT NULL,
  `lname` VARCHAR(25) NOT NULL,
  `password` CHAR(60) NOT NULL,
  PRIMARY KEY (`zid`)
);

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
