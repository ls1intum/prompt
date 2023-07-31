--liquibase formatted sql

--changeset author:airelawaleria

-- Device Enum Migration
CREATE TYPE device AS ENUM ('MACBOOK', 'IPHONE', 'IPAD', 'APPLE_WATCH', 'RASPBERRY_PI');
CREATE CAST (varchar AS device) WITH INOUT AS IMPLICIT;

ALTER TABLE developer_application
    RENAME COLUMN devices TO devices_deprecated;

ALTER TABLE developer_application
    ADD COLUMN devices device[];

ALTER TABLE coach_application
    RENAME COLUMN devices TO devices_deprecated;

ALTER TABLE coach_application
    ADD COLUMN devices device[];

ALTER TABLE tutor_application
    RENAME COLUMN devices TO devices_deprecated;

ALTER TABLE tutor_application
    ADD COLUMN devices device[];

UPDATE developer_application
SET devices = ARRAY(
        SELECT
            CASE
                WHEN value = 0 THEN 'MACBOOK'::device
                WHEN value = 1 THEN 'IPHONE'::device
                WHEN value = 2 THEN 'IPAD'::device
                WHEN value = 3 THEN 'APPLE_WATCH'::device
                WHEN value = 4 THEN 'RASPBERRY_PI'::device
                END
        FROM unnest(devices_deprecated) AS value
    );

UPDATE coach_application
SET devices = ARRAY(
        SELECT
            CASE
                WHEN value = 0 THEN 'MACBOOK'::device
                WHEN value = 1 THEN 'IPHONE'::device
                WHEN value = 2 THEN 'IPAD'::device
                WHEN value = 3 THEN 'APPLE_WATCH'::device
                WHEN value = 4 THEN 'RASPBERRY_PI'::device
                END
        FROM unnest(devices_deprecated) AS value
    );

UPDATE tutor_application
SET devices = ARRAY(
        SELECT
            CASE
                WHEN value = 0 THEN 'MACBOOK'::device
                WHEN value = 1 THEN 'IPHONE'::device
                WHEN value = 2 THEN 'IPAD'::device
                WHEN value = 3 THEN 'APPLE_WATCH'::device
                WHEN value = 4 THEN 'RASPBERRY_PI'::device
                END
        FROM unnest(devices_deprecated) AS value
    );

ALTER TABLE developer_application
    DROP COLUMN devices_deprecated;

ALTER TABLE coach_application
    DROP COLUMN devices_deprecated;

ALTER TABLE tutor_application
    DROP COLUMN devices_deprecated;

-- Device Enum Migration
CREATE TYPE course AS ENUM ('ITSE', 'PSE', 'ITP', 'IPRAKTIKUM', 'JASS', 'FK', 'THESIS');
CREATE CAST (varchar AS course) WITH INOUT AS IMPLICIT;

ALTER TABLE developer_application
    RENAME COLUMN courses_taken TO courses_taken_deprecated;

ALTER TABLE developer_application
    ADD COLUMN courses_taken course[];

ALTER TABLE coach_application
    RENAME COLUMN courses_taken TO courses_taken_deprecated;

ALTER TABLE coach_application
    ADD COLUMN courses_taken course[];

ALTER TABLE tutor_application
    RENAME COLUMN courses_taken TO courses_taken_deprecated;

ALTER TABLE tutor_application
    ADD COLUMN courses_taken course[];

UPDATE developer_application
SET courses_taken = ARRAY(
        SELECT
            CASE
                WHEN value = 0 THEN 'ITSE'::course
                WHEN value = 1 THEN 'PSE'::course
                WHEN value = 2 THEN 'ITP'::course
                WHEN value = 3 THEN 'IPRAKTIKUM'::course
                WHEN value = 4 THEN 'JASS'::course
                WHEN value = 5 THEN 'FK'::course
                WHEN value = 6 THEN 'THESIS'::course
                END
        FROM unnest(courses_taken_deprecated) AS value
    );

UPDATE coach_application
SET courses_taken = ARRAY(
        SELECT
            CASE
                WHEN value = 0 THEN 'ITSE'::course
                WHEN value = 1 THEN 'PSE'::course
                WHEN value = 2 THEN 'ITP'::course
                WHEN value = 3 THEN 'IPRAKTIKUM'::course
                WHEN value = 4 THEN 'JASS'::course
                WHEN value = 5 THEN 'FK'::course
                WHEN value = 6 THEN 'THESIS'::course
                END
        FROM unnest(courses_taken_deprecated) AS value
    );

UPDATE tutor_application
SET courses_taken = ARRAY(
        SELECT
            CASE
                WHEN value = 0 THEN 'ITSE'::course
                WHEN value = 1 THEN 'PSE'::course
                WHEN value = 2 THEN 'ITP'::course
                WHEN value = 3 THEN 'IPRAKTIKUM'::course
                WHEN value = 4 THEN 'JASS'::course
                WHEN value = 5 THEN 'FK'::course
                WHEN value = 6 THEN 'THESIS'::course
                END
        FROM unnest(courses_taken_deprecated) AS value
    );

ALTER TABLE developer_application
    DROP COLUMN courses_taken_deprecated;

ALTER TABLE coach_application
    DROP COLUMN courses_taken_deprecated;

ALTER TABLE tutor_application
    DROP COLUMN courses_taken_deprecated;

-- Gender Enum Migration
CREATE TYPE language_proficiency AS ENUM ('A1A2', 'B1B2', 'C1C2', 'NATIVE');
CREATE CAST (varchar AS language_proficiency) WITH INOUT AS IMPLICIT;

ALTER TABLE developer_application
    RENAME COLUMN english_language_proficiency TO english_language_proficiency_deprecated;
ALTER TABLE developer_application
    RENAME COLUMN german_language_proficiency TO german_language_proficiency_deprecated;

ALTER TABLE developer_application
    ADD COLUMN english_language_proficiency language_proficiency,
    ADD COLUMN german_language_proficiency language_proficiency;

ALTER TABLE coach_application
    RENAME COLUMN english_language_proficiency TO english_language_proficiency_deprecated;
ALTER TABLE coach_application
    RENAME COLUMN german_language_proficiency TO german_language_proficiency_deprecated;

ALTER TABLE coach_application
    ADD COLUMN english_language_proficiency language_proficiency,
    ADD COLUMN german_language_proficiency language_proficiency;

ALTER TABLE tutor_application
    RENAME COLUMN english_language_proficiency TO english_language_proficiency_deprecated;
ALTER TABLE tutor_application
    RENAME COLUMN german_language_proficiency TO german_language_proficiency_deprecated;

ALTER TABLE tutor_application
    ADD COLUMN english_language_proficiency language_proficiency,
    ADD COLUMN german_language_proficiency language_proficiency;

UPDATE developer_application
SET english_language_proficiency = CASE
                 WHEN english_language_proficiency_deprecated IS NULL THEN NULL
                 WHEN english_language_proficiency_deprecated = 0 THEN 'A1A2'::language_proficiency
                 WHEN english_language_proficiency_deprecated = 1 THEN 'B1B2'::language_proficiency
                 WHEN english_language_proficiency_deprecated = 2 THEN 'C1C2'::language_proficiency
                 WHEN english_language_proficiency_deprecated = 3 THEN 'NATIVE'::language_proficiency
    END;

UPDATE developer_application
SET german_language_proficiency = CASE
                                       WHEN german_language_proficiency_deprecated IS NULL THEN NULL
                                       WHEN german_language_proficiency_deprecated = 0 THEN 'A1A2'::language_proficiency
                                       WHEN german_language_proficiency_deprecated = 1 THEN 'B1B2'::language_proficiency
                                       WHEN german_language_proficiency_deprecated = 2 THEN 'C1C2'::language_proficiency
                                       WHEN german_language_proficiency_deprecated = 3 THEN 'NATIVE'::language_proficiency
    END;

UPDATE coach_application
SET english_language_proficiency = CASE
                                       WHEN english_language_proficiency_deprecated IS NULL THEN NULL
                                       WHEN english_language_proficiency_deprecated = 0 THEN 'A1A2'::language_proficiency
                                       WHEN english_language_proficiency_deprecated = 1 THEN 'B1B2'::language_proficiency
                                       WHEN english_language_proficiency_deprecated = 2 THEN 'C1C2'::language_proficiency
                                       WHEN english_language_proficiency_deprecated = 3 THEN 'NATIVE'::language_proficiency
    END;

UPDATE coach_application
SET german_language_proficiency = CASE
                                      WHEN german_language_proficiency_deprecated IS NULL THEN NULL
                                      WHEN german_language_proficiency_deprecated = 0 THEN 'A1A2'::language_proficiency
                                      WHEN german_language_proficiency_deprecated = 1 THEN 'B1B2'::language_proficiency
                                      WHEN german_language_proficiency_deprecated = 2 THEN 'C1C2'::language_proficiency
                                      WHEN german_language_proficiency_deprecated = 3 THEN 'NATIVE'::language_proficiency
    END;

UPDATE tutor_application
SET english_language_proficiency = CASE
                                       WHEN english_language_proficiency_deprecated IS NULL THEN NULL
                                       WHEN english_language_proficiency_deprecated = 0 THEN 'A1A2'::language_proficiency
                                       WHEN english_language_proficiency_deprecated = 1 THEN 'B1B2'::language_proficiency
                                       WHEN english_language_proficiency_deprecated = 2 THEN 'C1C2'::language_proficiency
                                       WHEN english_language_proficiency_deprecated = 3 THEN 'NATIVE'::language_proficiency
    END;

UPDATE tutor_application
SET german_language_proficiency = CASE
                                      WHEN german_language_proficiency_deprecated IS NULL THEN NULL
                                      WHEN german_language_proficiency_deprecated = 0 THEN 'A1A2'::language_proficiency
                                      WHEN german_language_proficiency_deprecated = 1 THEN 'B1B2'::language_proficiency
                                      WHEN german_language_proficiency_deprecated = 2 THEN 'C1C2'::language_proficiency
                                      WHEN german_language_proficiency_deprecated = 3 THEN 'NATIVE'::language_proficiency
    END;

ALTER TABLE developer_application
    DROP COLUMN english_language_proficiency_deprecated,
    DROP COLUMN german_language_proficiency_deprecated;
ALTER TABLE coach_application
    DROP COLUMN english_language_proficiency_deprecated,
    DROP COLUMN german_language_proficiency_deprecated;
ALTER TABLE tutor_application
    DROP COLUMN english_language_proficiency_deprecated,
    DROP COLUMN german_language_proficiency_deprecated;