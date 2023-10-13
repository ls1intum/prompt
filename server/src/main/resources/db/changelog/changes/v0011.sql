--liquibase formatted sql

--changeset author:airelawaleria

ALTER TYPE application_status ADD VALUE 'DROPPED_OUT';
ALTER TYPE application_status ADD VALUE 'INTRO_COURSE_PASSED';
ALTER TYPE application_status ADD VALUE 'INTRO_COURSE_NOT_PASSED';

ALTER TABLE intro_course_participation
    ADD COLUMN passed bool;