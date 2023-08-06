ALTER TABLE intro_course_participation
    ADD COLUMN course_iteration_id uuid,
    ADD COLUMN student_id uuid,
    ADD COLUMN tutor_id uuid,
    ADD COLUMN seat varchar(50),
    ADD COLUMN chair_device_required boolean not null default false;

UPDATE intro_course_participation
    SET student_id = developer_application.id
    FROM developer_application
    WHERE intro_course_participation.id = developer_application.intro_course_participation_id;

ALTER TABLE developer_application
    DROP COLUMN intro_course_participation_id;