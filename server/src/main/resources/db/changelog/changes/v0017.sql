--liquibase formatted sql

--changeset author:airelawaleria

ALTER TABLE skill
    ADD COLUMN course_iteration_id uuid;