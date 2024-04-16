--liquibase formatted sql

--changeset author:airelawaleria

CREATE TABLE development_profile (
                                id uuid NOT NULL,
                                gitlab_username varchar(255),
                                apple_id varchar(255),
                                mac_book_device_id varchar(255),
                                i_phone_device_id varchar(255),
                                i_pad_device_id varchar(255),
                                apple_watch_device_id varchar(255),
                                student_id uuid
);

INSERT INTO development_profile (id,
                                 gitlab_username,
                                 apple_id,
                                 mac_book_device_id,
                                 i_phone_device_id,
                                 i_pad_device_id,
                                 apple_watch_device_id,
                                 student_id)
SELECT uuid_generate_v4(),
       p.gitlab_username,
       p.apple_id,
       p.mac_book_device_id,
       p.i_phone_device_id,
       p.i_pad_device_id,
       p.apple_watch_device_id,
       d.student_id
FROM student_post_kickoff_submission p JOIN developer_application d
    ON d.post_kickoff_submission_id = p.id;

ALTER TABLE student_post_kickoff_submission
    DROP COLUMN gitlab_username;
ALTER TABLE student_post_kickoff_submission
    DROP COLUMN apple_id;
ALTER TABLE student_post_kickoff_submission
    DROP COLUMN mac_book_device_id;
ALTER TABLE student_post_kickoff_submission
    DROP COLUMN i_phone_device_id;
ALTER TABLE student_post_kickoff_submission
    DROP COLUMN i_pad_device_id;
ALTER TABLE student_post_kickoff_submission
    DROP COLUMN apple_watch_device_id;

ALTER TABLE intro_course_participation
    DROP COLUMN apple_id;
ALTER TABLE intro_course_participation
    DROP COLUMN mac_book_device_id;
ALTER TABLE intro_course_participation
    DROP COLUMN i_phone_device_id;
ALTER TABLE intro_course_participation
    DROP COLUMN i_pad_device_id;
ALTER TABLE intro_course_participation
    DROP COLUMN apple_watch_device_id;

ALTER TABLE student
    ADD COLUMN development_profile_id uuid;

UPDATE student s
    SET development_profile_id = dp.id
    FROM development_profile dp
    WHERE dp.student_id = s.id;

ALTER TABLE development_profile
    DROP COLUMN student_id;



