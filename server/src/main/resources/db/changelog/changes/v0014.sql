--liquibase formatted sql

--changeset author:airelawaleria

CREATE TABLE grade (
                                id uuid NOT NULL,
                                grade float4,
                                comment varchar(500)
);

ALTER TABLE developer_application
    ADD COLUMN grade_id uuid;

ALTER TABLE coach_application
    ADD COLUMN grade_id uuid;

ALTER TABLE tutor_application
    ADD COLUMN grade_id uuid;