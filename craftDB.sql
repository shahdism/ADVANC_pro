create database craft;
use craft;
CREATE TABLE users (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE skill (
    skillID INT PRIMARY KEY AUTO_INCREMENT,
    skillName VARCHAR(50) NOT NULL
);



CREATE TABLE interest (
    interestID INT PRIMARY KEY AUTO_INCREMENT,
    interestName VARCHAR(50) NOT NULL
);

CREATE TABLE project (
    projectID INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    diffLevel VARCHAR(20),
    groupSize INT,
    userID INT,
    FOREIGN KEY (userID) REFERENCES users(userID)
);
CREATE TABLE UserSkillInterest (
    RecordID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    SkillID INT,
    InterestID INT,
    FOREIGN KEY (UserID) REFERENCES users(userID),
    FOREIGN KEY (SkillID) REFERENCES skill(skillID),
    FOREIGN KEY (InterestID) REFERENCES interest(interestID)
);

CREATE TABLE material (
    materialID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    userID INT,
    amount DOUBLE,
    FOREIGN KEY (userID) REFERENCES users(userID)
);

CREATE TABLE tool (
    toolID INT PRIMARY KEY AUTO_INCREMENT,
    toolName VARCHAR(100) NOT NULL,
    userID INT,
    amount DOUBLE,
    FOREIGN KEY (userID) REFERENCES users(userID)
);

CREATE TABLE collaboration (
    collaborationID INT PRIMARY KEY AUTO_INCREMENT,
    projectID INT,
    userID INT,
    status VARCHAR(200)
);

CREATE TABLE communication (
    communicationID INT PRIMARY KEY AUTO_INCREMENT,
    collaborationID INT,
    senderID INT,
    message VARCHAR(200),
    timestamp TIMESTAMP
);

CREATE TABLE resourceShare (
    resourceShareID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    materialID INT,
    toolID INT
);

CREATE TABLE showcase (
    caseID INT PRIMARY KEY AUTO_INCREMENT,
    projectID INT,
    imageurl VARCHAR(200),
    description TEXT
);

INSERT INTO users (username, password, email) VALUES ('anwar', 'password444', 'anwar@gmail.com');
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL;

select *from project;

ALTER TABLE project ADD COLUMN skillID INT;
ALTER TABLE project ADD FOREIGN KEY (skillID) REFERENCES skill(skillID);
INSERT INTO skill (skillName) VALUES ('Woodworking');
INSERT INTO skill (skillName) VALUES ('painting');
INSERT INTO project (title, description, diffLevel, groupSize, userID, skillID)
VALUES ('Project 1', 'painting house', 'easy', 5, 1, 2);
INSERT INTO UserSkillInterest (UserID, SkillID)
VALUES (1, 2);