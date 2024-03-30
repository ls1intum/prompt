--liquibase formatted sql

--changeset author:airelawaleria

CREATE TYPE intro_course_absence_report_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
CREATE CAST (varchar AS intro_course_absence_report_status) WITH INOUT AS IMPLICIT;

ALTER TABLE intro_course_absence
    ADD COLUMN self_reported bool;

ALTER TABLE intro_course_absence
    ADD COLUMN status intro_course_absence_report_status;

UPDATE intro_course_absence
    SET self_reported = false;

UPDATE intro_course_absence
    SET status = 'ACCEPTED'::intro_course_absence_report_status;


