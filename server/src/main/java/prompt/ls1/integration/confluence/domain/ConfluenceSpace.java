package prompt.ls1.integration.confluence.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConfluenceSpace {

    public String id;
    public String key;
    public String name;
}
