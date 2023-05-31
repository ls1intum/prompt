package prompt.ls1.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Device {
    MACBOOK("Mac"), IPHONE("IPhone"), IPAD("IPad"), APPLE_WATCH("Watch");

    private String value;
}
