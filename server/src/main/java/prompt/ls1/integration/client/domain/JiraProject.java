package prompt.ls1.integration.client.domain;

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
    public String url;
    public JiraProjectCategory jiraProjectCategory;
}
