package prompt.ls1.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Course {
    ITSE("Introduction to Software Engineering"), PISE("Pattern in Software Engineering");

    private String value;
}
