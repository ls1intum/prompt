--liquibase formatted sql

--changeset author:airelawaleria

ALTER TABLE intro_course_participation
    ADD COLUMN apple_id varchar(255),
    ADD COLUMN mac_book_device_id varchar(255),
    ADD COLUMN i_phone_device_id varchar(255),
    ADD COLUMN i_pad_device_id varchar(255),
    ADD COLUMN apple_watch_device_id varchar(255);