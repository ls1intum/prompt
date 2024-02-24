package prompt.ls1.integration.tease.model;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class Allocation {
    // name
    private String projectId;
    // list of tumIds
    private List<UUID> students;
}
