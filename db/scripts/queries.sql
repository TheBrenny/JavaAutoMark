-- INSTALL COMMANDS EXTRACTED TO INSTALL.SQL

-- Insert teacher into Teacher Table
INSERT INTO Teacher (`zID`, `email`, `fname`, `lname`, `password`) VALUES       
    (5217759, 'z5217759@ad.unsw.edu.au', 'Jarod', 'Brennfleck', '$2b$12$nBqcI4CEVdSEam8iELnJf.jXvM.oXV7BU0Zb7OAnJdrXHAAfDoY4q'); -- Password is Brennfleck

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






