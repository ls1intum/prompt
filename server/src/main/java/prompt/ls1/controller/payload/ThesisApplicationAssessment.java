package prompt.ls1.controller.payload;

import lombok.Getter;
import lombok.Setter;
import prompt.ls1.model.enums.ApplicationStatus;

@Getter
@Setter
public class ThesisApplicationAssessment {
    private ApplicationStatus status;
    private String assessmentComment;
}
