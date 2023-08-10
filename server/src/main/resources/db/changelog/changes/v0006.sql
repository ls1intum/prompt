--liquibase formatted sql

--changeset author:airelawaleria


-- SkillProficiency Enum Migration
CREATE TYPE skill_proficiency AS ENUM ('NOVICE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
CREATE CAST (varchar AS skill_proficiency) WITH INOUT AS IMPLICIT;

ALTER TABLE intro_course_participation
    RENAME COLUMN supervisor_assessment TO supervisor_assessment_deprecated;

ALTER TABLE intro_course_participation
    ADD COLUMN self_assessment skill_proficiency,
    ADD COLUMN supervisor_assessment skill_proficiency;

UPDATE intro_course_participation
SET supervisor_assessment = CASE
                 WHEN supervisor_assessment_deprecated IS NULL THEN NULL
                 WHEN supervisor_assessment_deprecated = 0 THEN 'NOVICE'::skill_proficiency
                 WHEN supervisor_assessment_deprecated = 1 THEN 'INTERMEDIATE'::skill_proficiency
                 WHEN supervisor_assessment_deprecated = 2 THEN 'ADVANCED'::skill_proficiency
                 ELSE 'EXPERT'::skill_proficiency
    END;

UPDATE intro_course_participation
SET self_assessment = CASE
                                WHEN intro_course_self_assessment IS NULL THEN NULL
                                WHEN intro_course_self_assessment = 0 THEN 'NOVICE'::skill_proficiency
                                WHEN intro_course_self_assessment = 1 THEN 'INTERMEDIATE'::skill_proficiency
                                WHEN intro_course_self_assessment = 2 THEN 'ADVANCED'::skill_proficiency
                                ELSE 'EXPERT'::skill_proficiency
    END;

ALTER TABLE intro_course_participation
    DROP COLUMN supervisor_assessment_deprecated,
    DROP COLUMN intro_course_self_assessment;