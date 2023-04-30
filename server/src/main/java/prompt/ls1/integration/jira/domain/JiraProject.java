package prompt.ls1.integration.jira.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JiraProject {

    public String id;
    public String key;
    public String name;
    public String lead;
    public String categoryId;
    public String description;
    public String url;
}
