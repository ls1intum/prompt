package prompt.ls1.integration.tease.model;

import lombok.Data;

@Data
public class Allocation {
    // key
    private String projectId;
    // list of tumIds
    private String[] students;
}
