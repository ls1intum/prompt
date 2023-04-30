package prompt.ls1.integration.bitbucket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.integration.bitbucket.BitbucketRestClient;
import prompt.ls1.integration.bitbucket.domain.BitbucketProject;
import prompt.ls1.integration.bitbucket.domain.BitbucketProjectPermissionGrant;
import prompt.ls1.integration.bitbucket.domain.BitbucketRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class BitbucketIntegrationService {

    @Autowired
    private BitbucketRestClient bitbucketRestClient;

    public List<BitbucketProject> createProjects(final List<String> projectKeys) {
        final List<BitbucketProject> bitbucketProjects = new ArrayList<>();
        projectKeys.forEach(projectKey -> {
            bitbucketProjects.add(bitbucketRestClient.createProject(projectKey));
        });

        return bitbucketProjects;
    }

    public List<BitbucketRepository> createRepositories(final List<String> projectKeys) {
        final List<BitbucketRepository> bitbucketRepositories = new ArrayList<>();
        projectKeys.forEach(projectKey -> {
            bitbucketRepositories.add(bitbucketRestClient.createRepository(projectKey, projectKey));
        });

        return bitbucketRepositories;
    }

    public void grantProjectPermissions(final List<BitbucketProjectPermissionGrant> bitbucketProjectPermissionGrants) {
        bitbucketProjectPermissionGrants.forEach(bitbucketProjectPermissionGrant -> {
            bitbucketProjectPermissionGrant.getGroupNames().forEach(groupName -> {
                bitbucketRestClient.grantProjectPermission(bitbucketProjectPermissionGrant.getProjectKey(),
                        bitbucketProjectPermissionGrant.getPermission(), groupName);
            });
        });
    }
}
