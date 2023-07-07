ALTER TABLE student
    ADD COLUMN suggested_as_coach BOOLEAN,
    ADD COLUMN suggested_as_tutor BOOLEAN,
    ADD COLUMN blocked_by_pm BOOLEAN,
    ADD COLUMN reason_for_blocked_by_pm OID;


UPDATE student s
SET suggested_as_coach = COALESCE((SELECT aa.suggested_as_coach
                        FROM student_developer_application sda, developer_application da, application_assessment aa
                        WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id AND aa.suggested_as_coach = TRUE),
                        suggested_as_coach),
    suggested_as_tutor = COALESCE((SELECT aa.suggested_as_tutor
                        FROM student_developer_application sda, developer_application da, application_assessment aa
                        WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id AND aa.suggested_as_tutor = TRUE),
                        suggested_as_tutor),
    blocked_by_pm = COALESCE((SELECT aa.blocked_bypm
                   FROM student_developer_application sda, developer_application da, application_assessment aa
                   WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id AND aa.blocked_bypm = TRUE),
                    blocked_by_pm),
    reason_for_blocked_by_pm = COALESCE((SELECT aa.reason_for_blocked_bypm
                        FROM student_developer_application sda, developer_application da, application_assessment aa
                        WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id),
                    reason_for_blocked_by_pm);

UPDATE student s
SET suggested_as_coach = COALESCE((SELECT aa.suggested_as_coach
                          FROM student_coach_application sda, coach_application da, application_assessment aa
                          WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id AND aa.suggested_as_coach = TRUE),
                        suggested_as_coach),
    suggested_as_tutor = COALESCE((SELECT aa.suggested_as_tutor
                          FROM student_coach_application sda, coach_application da, application_assessment aa
                          WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id AND aa.suggested_as_tutor = TRUE),
                        suggested_as_tutor),
    blocked_by_pm = COALESCE((SELECT aa.blocked_bypm
                     FROM student_coach_application sda, coach_application da, application_assessment aa
                     WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id AND aa.blocked_bypm = TRUE),
                    blocked_by_pm),
    reason_for_blocked_by_pm = COALESCE((SELECT aa.reason_for_blocked_bypm
                                FROM student_coach_application sda, coach_application da, application_assessment aa
                                WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id),
                                reason_for_blocked_by_pm);

UPDATE student s
SET suggested_as_coach = COALESCE((SELECT aa.suggested_as_coach
                          FROM student_tutor_application sda, tutor_application da, application_assessment aa
                          WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id AND aa.suggested_as_coach = TRUE),
                        suggested_as_coach),
    suggested_as_tutor = COALESCE((SELECT aa.suggested_as_tutor
                          FROM student_tutor_application sda, tutor_application da, application_assessment aa
                          WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id AND aa.suggested_as_tutor = TRUE),
                        suggested_as_tutor),
    blocked_by_pm = COALESCE((SELECT aa.blocked_bypm
                     FROM student_tutor_application sda, tutor_application da, application_assessment aa
                     WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id AND aa.blocked_bypm = TRUE),
                    blocked_by_pm),
    reason_for_blocked_by_pm = COALESCE((SELECT aa.reason_for_blocked_bypm
                                FROM student_tutor_application sda, tutor_application da, application_assessment aa
                                WHERE sda.student_id = s.id AND sda.application_id = da.id AND aa.id = da.application_assessment_id),
                                reason_for_blocked_by_pm);

ALTER TABLE application_assessment
    DROP COLUMN suggested_as_coach,
    DROP COLUMN suggested_as_tutor,
    DROP COLUMN blocked_bypm,
    DROP COLUMN reason_for_blocked_bypm;