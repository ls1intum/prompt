package prompt.ls1.integration.confluence.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.integration.confluence.ConfluenceRestClient;
import prompt.ls1.integration.confluence.domain.ConfluenceSpace;

import java.util.ArrayList;
import java.util.List;

@Service
public class ConfluenceIntegrationService {

    @Autowired
    private ConfluenceRestClient confluenceRestClient;

    public List<ConfluenceSpace> createSpaces(final List<String> confluenceSpaceNames) {
        final List<ConfluenceSpace> confluenceSpaces = new ArrayList<>();
        confluenceSpaceNames.forEach(confluenceSpaceName -> {
            confluenceSpaces.add(confluenceRestClient.createSpace(confluenceSpaceName, confluenceSpaceName));
        });

        return confluenceSpaces;
    }
}
