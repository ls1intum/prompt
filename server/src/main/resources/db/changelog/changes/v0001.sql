--liquibase formatted sql

--changeset author:airelawaleria

CREATE TYPE application_status AS ENUM ('NOT_ASSESSED', 'PENDING_INTERVIEW', 'ACCEPTED', 'REJECTED', 'ENROLLED');
CREATE CAST (varchar AS application_status) WITH INOUT AS IMPLICIT;

ALTER TABLE application_assessment
    ADD COLUMN status application_status NOT NULL DEFAULT 'NOT_ASSESSED';

UPDATE application_assessment
SET status = CASE
                WHEN accepted IS NULL THEN 'NOT_ASSESSED'::application_status
                WHEN accepted = true THEN 'ACCEPTED'::application_status
                WHEN interview_invite_sent = true THEN 'PENDING_INTERVIEW'::application_status
                ELSE 'REJECTED'::application_status
END;

ALTER TABLE application_assessment
    DROP COLUMN accepted,
    DROP COLUMN interview_invite_sent,
    DROP COLUMN acceptance_sent,
    DROP COLUMN rejection_sent;
