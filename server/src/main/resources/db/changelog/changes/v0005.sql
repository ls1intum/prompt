--liquibase formatted sql

--changeset author:airelawaleria

ALTER TABLE course_iteration
    ADD COLUMN intro_course_start DATE,
    ADD COLUMN intro_course_end DATE;

ALTER TABLE intro_course_participation
    ADD COLUMN course_iteration_id uuid,
    ADD COLUMN student_id uuid,
    ADD COLUMN tutor_id uuid,
    ADD COLUMN seat varchar(50),
    ADD COLUMN chair_device varchar(255);

ALTER TABLE intro_course_participation
    ALTER COLUMN tutor_comments TYPE varchar(500);
ALTER TABLE intro_course_participation
    ALTER COLUMN student_comments TYPE varchar(500);

UPDATE intro_course_participation
    SET student_id = developer_application.id
    FROM developer_application
    WHERE intro_course_participation.id = developer_application.intro_course_participation_id;

ALTER TABLE developer_application
    DROP COLUMN intro_course_participation_id;

CREATE TABLE intro_course_absence (
    id uuid NOT NULL,
    date DATE,
    excuse varchar(255)
);

CREATE TABLE intro_course_participation_absence (
    intro_course_participation_id uuid NOT NULL,
    intro_course_absence_id uuid NOT NULL
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO intro_course_participation (id, course_iteration_id, student_id, tutor_id, seat, chair_device)
SELECT uuid_generate_v4(), da.course_iteration_id, da.student_id, null, null, null
FROM developer_application da, application_assessment aa
WHERE da.application_assessment_id = aa.id and aa.status = 'ENROLLED';