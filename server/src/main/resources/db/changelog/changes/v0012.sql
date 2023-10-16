--liquibase formatted sql

--changeset author:airelawaleria

ALTER TABLE intro_course_participation
    ADD COLUMN dropped_out bool;