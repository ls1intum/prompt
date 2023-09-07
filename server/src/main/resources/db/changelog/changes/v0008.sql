--liquibase formatted sql

--changeset author:airelawaleria

-- Extend Application Status enum
ALTER TYPE application_status ADD VALUE 'IN_PROGRESS';
ALTER TYPE application_status ADD VALUE 'FINISHED';

-- Research Topic Enum
CREATE TYPE research_area AS ENUM ('EDUCATION_TECHNOLOGIES', 'HUMAN_COMPUTER_INTERACTION', 'ROBOTIC', 'SOFTWARE_ENGINEERING');
CREATE CAST (varchar AS research_area) WITH INOUT AS IMPLICIT;

-- Focus Area Enum
CREATE TYPE focus_topic AS ENUM (
    'COMPETENCIES',
    'TEAM_BASED_LEARNING',
    'AUTOMATIC_ASSESSMENT',
    'LEARNING_PLATFORMS',
    'MACHINE_LEARNING',
    'DEI',
    'LEARNING_ANALYTICS',
    'ADAPTIVE_LEARNING',
    'K12_SCHOOLS',
    'SECURITY',
    'INFRASTRUCTURE',
    'AGILE_DEVELOPMENT',
    'MOBILE_DEVELOPMENT',
    'CONTINUOUS',
    'MODELING',
    'INNOVATION',
    'PROJECT_COURSES',
    'DISTRIBUTED_SYSTEMS',
    'DEPLOYMENT',
    'DEV_OPS',
    'INTERACTION_DESIGN',
    'USER_INVOLVEMENT',
    'USER_EXPERIENCE',
    'CREATIVITY',
    'USER_MODEL',
    'INTERACTIVE_TECHNOLOGY',
    'MOCK_UPS',
    'PROTOTYPING',
    'EMBEDDED_SYSTEMS',
    'DUCKIETOWN',
    'AUTONOMOUS_DRIVING',
    'COMMUNICATION',
    'DISTRIBUTED_CONTROL',
    'LEARNING_AUTONOMY',
    'HW_SW_CO_DESIGN');
CREATE CAST (varchar AS focus_topic) WITH INOUT AS IMPLICIT;

-- Table Thesis Application
CREATE TABLE thesis_application (
    id uuid PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    student_id UUID NOT NULL,
    current_semester SMALLINT,
    study_degree study_degree,
    study_program study_program,
    desired_thesis_start DATE,
    thesis_title VARCHAR(255),
    interests VARCHAR(1000),
    projects VARCHAR(1000),
    special_skills VARCHAR(1000),
    motivation VARCHAR(500),
    courses_taken course[],
    research_areas research_area[],
    focus_topics focus_topic[],
    assessment_comment VARCHAR(2000),
    application_status application_status,
    examination_report_filename VARCHAR(255),
    cv_filename VARCHAR(255),
    bachelor_report_filename VARCHAR(255),
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES student (id)
);