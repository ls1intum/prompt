package prompt.ls1.integration.jira.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JiraProjectCategory {

    public String id;
    public String name;
    public String description;
}
