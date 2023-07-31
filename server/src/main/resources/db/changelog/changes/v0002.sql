--liquibase formatted sql

--changeset author:airelawaleria


-- Gender Enum Migration
CREATE TYPE gender AS ENUM ('FEMALE', 'MALE', 'OTHER', 'PREFER_NOT_TO_SAY');
CREATE CAST (varchar AS gender) WITH INOUT AS IMPLICIT;

ALTER TABLE student
    RENAME COLUMN gender TO gender_deprecated;

ALTER TABLE student
    ADD COLUMN gender gender;

UPDATE student
SET gender = CASE
                 WHEN gender_deprecated IS NULL THEN NULL
                 WHEN gender_deprecated = 0 THEN 'FEMALE'::gender
                 WHEN gender_deprecated = 1 THEN 'MALE'::gender
                 WHEN gender_deprecated = 2 THEN 'OTHER'::gender
                 ELSE 'PREFER_NOT_TO_SAY'::gender
END;

ALTER TABLE student
    DROP COLUMN gender_deprecated;

-- StudyProgram Enum Migration
CREATE TYPE study_program AS ENUM ('COMPUTER_SCIENCE', 'INFORMATION_SYSTEMS', 'GAMES_ENGINEERING', 'MANAGEMENT_AND_TECHNOLOGY', 'OTHER');
CREATE CAST (varchar AS study_program) WITH INOUT AS IMPLICIT;

ALTER TABLE developer_application
    RENAME COLUMN study_program TO study_program_deprecated;
ALTER TABLE coach_application
    RENAME COLUMN study_program TO study_program_deprecated;
ALTER TABLE tutor_application
    RENAME COLUMN study_program TO study_program_deprecated;

ALTER TABLE developer_application
    ADD COLUMN study_program study_program;
ALTER TABLE coach_application
    ADD COLUMN study_program study_program;
ALTER TABLE tutor_application
    ADD COLUMN study_program study_program;

UPDATE developer_application
SET study_program = CASE
                 WHEN study_program_deprecated IS NULL THEN NULL
                 WHEN study_program_deprecated = 0 THEN 'COMPUTER_SCIENCE'::study_program
                 WHEN study_program_deprecated = 1 THEN 'INFORMATION_SYSTEMS'::study_program
                 WHEN study_program_deprecated = 2 THEN 'GAMES_ENGINEERING'::study_program
                 WHEN study_program_deprecated = 3 THEN 'MANAGEMENT_AND_TECHNOLOGY'::study_program
                 ELSE 'OTHER'::study_program
END;

UPDATE coach_application
SET study_program = CASE
                        WHEN study_program_deprecated IS NULL THEN NULL
                        WHEN study_program_deprecated = 0 THEN 'COMPUTER_SCIENCE'::study_program
                        WHEN study_program_deprecated = 1 THEN 'INFORMATION_SYSTEMS'::study_program
                        WHEN study_program_deprecated = 2 THEN 'GAMES_ENGINEERING'::study_program
                        WHEN study_program_deprecated = 3 THEN 'MANAGEMENT_AND_TECHNOLOGY'::study_program
                        ELSE 'OTHER'::study_program
END;

UPDATE tutor_application
SET study_program = CASE
                        WHEN study_program_deprecated IS NULL THEN NULL
                        WHEN study_program_deprecated = 0 THEN 'COMPUTER_SCIENCE'::study_program
                        WHEN study_program_deprecated = 1 THEN 'INFORMATION_SYSTEMS'::study_program
                        WHEN study_program_deprecated = 2 THEN 'GAMES_ENGINEERING'::study_program
                        WHEN study_program_deprecated = 3 THEN 'MANAGEMENT_AND_TECHNOLOGY'::study_program
                        ELSE 'OTHER'::study_program
END;

ALTER TABLE developer_application
    DROP COLUMN study_program_deprecated;
ALTER TABLE coach_application
    DROP COLUMN study_program_deprecated;
ALTER TABLE tutor_application
    DROP COLUMN study_program_deprecated;

-- StudyDegree Enum Migration
CREATE TYPE study_degree AS ENUM ('BACHELOR', 'MASTER');
CREATE CAST (varchar AS study_degree) WITH INOUT AS IMPLICIT;

ALTER TABLE developer_application
    RENAME COLUMN study_degree TO study_degree_deprecated;
ALTER TABLE coach_application
    RENAME COLUMN study_degree TO study_degree_deprecated;
ALTER TABLE tutor_application
    RENAME COLUMN study_degree TO study_degree_deprecated;

ALTER TABLE developer_application
    ADD COLUMN study_degree study_degree;
ALTER TABLE coach_application
    ADD COLUMN study_degree study_degree;
ALTER TABLE tutor_application
    ADD COLUMN study_degree study_degree;

UPDATE developer_application
SET study_degree = CASE
                        WHEN study_degree_deprecated IS NULL THEN NULL
                        WHEN study_degree_deprecated = 0 THEN 'BACHELOR'::study_degree
                        ELSE 'MASTER'::study_degree
END;

UPDATE coach_application
SET study_degree = CASE
                       WHEN study_degree_deprecated IS NULL THEN NULL
                       WHEN study_degree_deprecated = 0 THEN 'BACHELOR'::study_degree
                       ELSE 'MASTER'::study_degree
END;

UPDATE tutor_application
SET study_degree = CASE
                       WHEN study_degree_deprecated IS NULL THEN NULL
                       WHEN study_degree_deprecated = 0 THEN 'BACHELOR'::study_degree
                       ELSE 'MASTER'::study_degree
END;

ALTER TABLE developer_application
    DROP COLUMN study_degree_deprecated;
ALTER TABLE coach_application
    DROP COLUMN study_degree_deprecated;
ALTER TABLE tutor_application
    DROP COLUMN study_degree_deprecated;