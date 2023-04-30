package prompt.ls1.integration.bitbucket.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BitbucketProjectPermissionGrant {

    public String projectKey;
    public String permission;
    public List<String> groupNames;
}
