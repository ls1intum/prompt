--liquibase formatted sql

--changeset author:airelawaleria

ALTER TABLE developer_application
    ADD COLUMN student_id uuid;

UPDATE developer_application
SET student_id = student_developer_application.student_id
FROM student_developer_application
WHERE developer_application.id = student_developer_application.application_id;

ALTER TABLE developer_application
    ALTER COLUMN student_id SET NOT NULL;

ALTER TABLE coach_application
    ADD COLUMN student_id uuid;

UPDATE coach_application
SET student_id = student_coach_application.student_id
FROM student_coach_application
WHERE coach_application.id = student_coach_application.application_id;

ALTER TABLE coach_application
    ALTER COLUMN student_id SET NOT NULL;

ALTER TABLE tutor_application
    ADD COLUMN student_id uuid;

UPDATE tutor_application
SET student_id = student_tutor_application.student_id
FROM student_tutor_application
WHERE tutor_application.id = student_tutor_application.application_id;

ALTER TABLE tutor_application
    ALTER COLUMN student_id SET NOT NULL;

DROP TABLE student_developer_application;
DROP TABLE student_coach_application;
DROP TABLE student_tutor_application;
