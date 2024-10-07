--liquibase formatted sql

--changeset author:niclasheun

-- Drop CAST from focus_topic
DROP CAST IF EXISTS (varchar AS focus_topic);

-- Drop focus_topic ENUM
DROP TYPE IF EXISTS focus_topic CASCADE;

DROP CAST IF EXISTS (varchar AS research_area);
DROP TYPE IF EXISTS research_area CASCADE;

-- Drop thesis_application table
DROP TABLE IF EXISTS thesis_application CASCADE;

-- Drop the thesis_advisor table (if necessary)
DROP TABLE IF EXISTS thesis_advisor CASCADE;