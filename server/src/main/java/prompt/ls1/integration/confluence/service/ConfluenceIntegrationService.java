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

    public List<ConfluenceSpace> findSpacesByKeys(final List<String> spaceKeys) {
        return confluenceRestClient.findSpacesByKeys(spaceKeys);
    }

    public List<ConfluenceSpace> createSpaces(final List<ConfluenceSpace> confluenceSpaces) {
        final List<ConfluenceSpace> confluenceSpacesResult = new ArrayList<>();
        confluenceSpaces.forEach(confluenceSpace -> {
            confluenceSpacesResult.add(confluenceRestClient.createSpace(confluenceSpace));
        });

        return confluenceSpacesResult;
    }

    public void assignSpacePermissionToUserGroups(final String spaceKey, final List<String> userGroupNames) {
        userGroupNames.forEach(userGroupName -> {
            confluenceRestClient.assignSpacePermissionToUserGroup(spaceKey, userGroupName, "administer");
        });
    }
}
