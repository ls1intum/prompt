package prompt.ls1.integration.tease.model;

import lombok.Data;

@Data
public class Allocation {
    private Project project;
    private Student[] students;
}
