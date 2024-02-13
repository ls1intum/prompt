--liquibase formatted sql

--changeset author:airelawaleria

ALTER TABLE project_team
    ADD COLUMN project_lead_tum_id varchar(20);

ALTER TABLE project_team
    ADD COLUMN coach_tum_id varchar(20);