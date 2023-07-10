ALTER TABLE coach_application
    ADD COLUMN interview_invite_sent BOOLEAN;

ALTER TABLE course_iteration
    ADD COLUMN coach_interview_date DATE,
    ADD COLUMN tutor_interview_date DATE,
    ADD COLUMN coach_interview_planner_link VARCHAR(250),
    ADD COLUMN tutor_interview_planner_link VARCHAR(250),
    ADD COLUMN coach_interview_location VARCHAR(250),
    ADD COLUMN tutor_interview_location VARCHAR(250);