--liquibase formatted sql

--changeset author:airelawaleria

CREATE TABLE thesis_advisor (
    id uuid NOT NULL,
    first_name varchar(255),
    last_name varchar(255),
    tum_id varchar(50),
    email varchar(255)
);

ALTER TABLE thesis_application
    ADD COLUMN thesis_advisor_id uuid;