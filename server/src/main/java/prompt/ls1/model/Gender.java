package prompt.ls1.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Gender {
    FEMALE("Female"), MALE("Male"), OTHER("Other"), PREFER_NOT_TO_SAY("Prefer not to say");

    private String value;
}
