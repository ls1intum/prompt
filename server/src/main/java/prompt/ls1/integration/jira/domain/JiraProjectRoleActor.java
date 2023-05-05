package prompt.ls1.integration.jira.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JiraProjectRoleActor {

    public String projectKey;
    public String roleId;
    public List<String> groupNames;
}
