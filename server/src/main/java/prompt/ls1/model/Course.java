package prompt.ls1.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Course {
    ITSE("Introduction to Software Engineering (IN0006)"),
    PISE("Patterns in Software Engineering (IN2081)"),
    ITP("Introduction to Programming (CIT5230000)"),
    IPRAKTIKUM("iPraktikum (IN0012, IN2106, IN2128)"),
    JASS("Joint Advanced Student School"),
    FK("Ferienakademie"),
    THESIS("Thesis");

    private String value;
}
