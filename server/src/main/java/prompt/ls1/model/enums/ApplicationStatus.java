package prompt.ls1.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ApplicationStatus {
    NOT_ASSESSED("Not assessed"),
    PENDING_INTERVIEW("Pending interview"),
    ACCEPTED("Accepted"),
    REJECTED("Rejected"),
    ENROLLED("Enrolled"),
    IN_PROGRESS("In progress"),
    FINISHED("Finished"),
    INTRO_COURSE_PASSED("Intro course passed"),
    INTRO_COURSE_NOT_PASSED("Intro course not passed");

    private String value;
}
