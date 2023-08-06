--liquibase formatted sql

--changeset author:airelawaleria

ALTER TABLE course_iteration
    ADD COLUMN intro_course_start DATE,
    ADD COLUMN intro_course_end DATE;