--liquibase formatted sql

--changeset author:airelawaleria

ALTER TABLE student_post_kickoff_submission
    ADD COLUMN gitlab_username varchar(255);