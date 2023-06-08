package prompt.ls1.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum StudyDegree {
    BACHELOR("Bachelor"), MASTER("Master");

    private String value;
}
