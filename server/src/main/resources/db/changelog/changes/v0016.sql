--liquibase formatted sql

--changeset author:airelawaleria

-- developer-application

ALTER TABLE developer_application
    RENAME COLUMN motivation TO motivation_deprecated;

ALTER TABLE developer_application
    RENAME COLUMN experience TO experience_deprecated;

ALTER TABLE developer_application
    ADD COLUMN motivation text;

ALTER TABLE developer_application
    ADD COLUMN experience text;

UPDATE developer_application
    SET motivation = convert_from(lo_get(motivation_deprecated), 'UTF8');

UPDATE developer_application
    SET experience = convert_from(lo_get(experience_deprecated), 'UTF8');

ALTER TABLE developer_application
    DROP COLUMN motivation_deprecated;

ALTER TABLE developer_application
    DROP COLUMN experience_deprecated;

-- coach-application

ALTER TABLE coach_application
    RENAME COLUMN motivation TO motivation_deprecated;

ALTER TABLE coach_application
    RENAME COLUMN experience TO experience_deprecated;

ALTER TABLE coach_application
    RENAME COLUMN solved_problem TO solved_problem_deprecated;

ALTER TABLE coach_application
    ADD COLUMN motivation text;

ALTER TABLE coach_application
    ADD COLUMN experience text;

ALTER TABLE coach_application
    ADD COLUMN solved_problem text;

UPDATE coach_application
SET motivation = convert_from(lo_get(motivation_deprecated), 'UTF8');

UPDATE coach_application
SET experience = convert_from(lo_get(experience_deprecated), 'UTF8');

UPDATE coach_application
SET solved_problem = convert_from(lo_get(solved_problem_deprecated), 'UTF8');

ALTER TABLE coach_application
    DROP COLUMN motivation_deprecated;

ALTER TABLE coach_application
    DROP COLUMN experience_deprecated;

ALTER TABLE coach_application
    DROP COLUMN solved_problem_deprecated;

-- tutor-application

ALTER TABLE tutor_application
    RENAME COLUMN motivation TO motivation_deprecated;

ALTER TABLE tutor_application
    RENAME COLUMN experience TO experience_deprecated;

ALTER TABLE tutor_application
    RENAME COLUMN reason_good_tutor TO reason_good_tutor_deprecated;

ALTER TABLE tutor_application
    ADD COLUMN motivation text;

ALTER TABLE tutor_application
    ADD COLUMN experience text;

ALTER TABLE tutor_application
    ADD COLUMN reason_good_tutor text;

UPDATE tutor_application
SET motivation = convert_from(lo_get(motivation_deprecated), 'UTF8');

UPDATE tutor_application
SET experience = convert_from(lo_get(experience_deprecated), 'UTF8');

UPDATE tutor_application
SET reason_good_tutor = convert_from(lo_get(reason_good_tutor_deprecated), 'UTF8');

ALTER TABLE tutor_application
    DROP COLUMN motivation_deprecated;

ALTER TABLE tutor_application
    DROP COLUMN experience_deprecated;

ALTER TABLE tutor_application
    DROP COLUMN reason_good_tutor_deprecated;

-- student

ALTER TABLE student
    RENAME COLUMN reason_for_blocked_by_pm TO reason_for_blocked_by_pm_deprecated;

ALTER TABLE student
    ADD COLUMN reason_for_blocked_by_pm text;

UPDATE student
SET reason_for_blocked_by_pm = convert_from(lo_get(reason_for_blocked_by_pm_deprecated), 'UTF8');

ALTER TABLE student
    DROP COLUMN reason_for_blocked_by_pm_deprecated;

-- instructor-comment

ALTER TABLE instructor_comment
    RENAME COLUMN text TO text_deprecated;

ALTER TABLE instructor_comment
    ADD COLUMN text text;

UPDATE instructor_comment
SET text = convert_from(lo_get(text_deprecated), 'UTF8');

ALTER TABLE instructor_comment
    DROP COLUMN text_deprecated;

-- post-kick-off-submission

ALTER TABLE student_post_kickoff_submission
    RENAME COLUMN reason_for_first_choice TO reason_for_first_choice_deprecated;

ALTER TABLE student_post_kickoff_submission
    RENAME COLUMN reason_for_last_choice TO reason_for_last_choice_deprecated;

ALTER TABLE student_post_kickoff_submission
    ADD COLUMN reason_for_first_choice text;

ALTER TABLE student_post_kickoff_submission
    ADD COLUMN reason_for_last_choice text;

UPDATE student_post_kickoff_submission
SET reason_for_first_choice = convert_from(lo_get(reason_for_first_choice_deprecated), 'UTF8');

UPDATE student_post_kickoff_submission
SET reason_for_last_choice = convert_from(lo_get(reason_for_last_choice_deprecated), 'UTF8');

ALTER TABLE student_post_kickoff_submission
    DROP COLUMN reason_for_first_choice_deprecated;

ALTER TABLE student_post_kickoff_submission
    DROP COLUMN reason_for_last_choice_deprecated;

