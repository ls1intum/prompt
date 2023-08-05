ALTER TABLE intro_course_participation
    ADD COLUMN developer_application_id uuid,
    ADD COLUMN tutor_application_id uuid,
    ADD COLUMN seat varchar(50);

UPDATE intro_course_participation
    SET developer_application_id = developer_application.id
    FROM developer_application
    WHERE intro_course_participation.id = developer_application.intro_course_participation_id;

ALTER TABLE developer_application
    DROP COLUMN intro_course_participation_id;