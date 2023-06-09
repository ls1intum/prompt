package prompt.ls1.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SkillProficiency {
    NOVICE("Novice"), INTERMEDIATE("Intermediate"), ADVANCED("Advanced"), EXPERT("Expert");

    private String value;
}
