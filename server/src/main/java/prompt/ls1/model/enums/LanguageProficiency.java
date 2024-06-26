package prompt.ls1.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum LanguageProficiency {
    A1A2("A1/A2"), B1B2("B1/B2"), C1C2("C1/C2"), NATIVE("Native");

    private String value;
}
