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
    FINISHED("Finished");

    private String value;
}
