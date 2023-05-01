package prompt.ls1.integration.bitbucket.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BitbucketRepository {

    public String id;
    public String name;
    public String slug;
    public BitbucketProject project;
}
