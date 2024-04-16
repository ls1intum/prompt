--liquibase formatted sql

--changeset author:airelawaleria

ALTER TABLE student
    DROP COLUMN public_id;