 -- Create Teacher Table
 create table Teacher (
     zID mediumint unique,
     email varchar(320) not null,
     teacher_name varchar(50) not null,
     teacher_password char(60) not null,
     primary key (zID)
 );

-- Create Course Table
 create table Course (
     course_uuid int auto_increment unique,
     course_ID char(8) not null,
     course_name varchar(100) not null,
     running_year smallint not null,
     primary key  (course_ID, running_year)
 );

-- Create Assignmnet Table
 create table Assignment (
     assignment_ID int auto_increment unique,
     course_uuid int not null,
     test_code blob default "{}",
     primary key  (assignment_ID),
     foreign key (course_uuid) references Course(course_uuid)
 );

-- Create TestCase Table
--  create table TestCase (
--      test_ID int,
--      expectation varchar(250) not null,
--      test_code_location varchar(100) not null,
--      assignment_ID int not null,
--      primary key  (test_ID)
--      foreign key (assignment_ID) references Assignment(assignment_ID)
--  );

-- Create Report Table 
 create table Report (
     report_ID int auto_increment unique,
     zID mediumint not null,
     student_name varchar(50) not null,
     report_results blob default "{}",
     assignment_ID int not null,
     primary key  (zID, assignment_ID),
     foreign key (assignment_ID) references Assignment(assignment_ID)
 );

-- Insert teacher into Teacher Table
insert into Teacher (zID, email, teacher_name, teacher_password,)
 values();

-- Insert Course into Course table
insert into Course(course_ID, course_name)
values();

--Insert Assignment into Assignment table
insert into Assignment(assignment_ID, course_ID, code_location)
values("",(select course_ID from Course where Course.course_ID = "") );

-- Insert testcase into Testcase table
insert into TestCase(test_ID, expectation, test_code_location, assignment_ID)
values("","","",(select assignment_ID from Assignment where Assignment.assignment_ID = ""));

-- Insert report into Report table 
insert into Report(report_ID, zID, student_name, report_location, assignment_ID)
values("","","","",(select assignment_ID from Assignment where Assignment.assignment_ID = ""));

-- Delete teacher from teacher table
delete from Teacher where zID = "";

-- Delete course from Course table
delete from Course where course_ID = "";

-- Delete assignemnt from Assignment Table
delete from Assignment where assignment_ID = "";

-- Delete testcase from Testcase table
delete from TestCase where test_ID = "";

-- Delete report from report table
delete from Report where report_ID = "";

-- Update teacher from Teacher table
update Teacher
set zID = "", email = "", teacher_name = "", teacher_password = ""
where zID = "";

-- Update course from Course table
update Course
set course_ID = "", course_name = ""
where course_ID = "";

-- Update assignment from Assignment table
update Assignment
set assignment_ID = "", course_ID = "", code_location = ""
where assignment_ID = "";

-- Update testcase from testcase table
update TestCase
set test_ID = "", expectation = "", test_code_location = "", assignment_ID = ""
where test_ID = "";

-- Update report from Report table
update Report 
set report_ID = "", zID = "", student_name = "", report_location = "", assignment_ID = ""
where report_ID = "";






