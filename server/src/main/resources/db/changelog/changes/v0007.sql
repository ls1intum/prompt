--liquibase formatted sql

--changeset author:airelawaleria

ALTER TABLE course_iteration
    ADD COLUMN kickoff_submission_period_start DATE,
    ADD COLUMN kickoff_submission_period_end DATE;