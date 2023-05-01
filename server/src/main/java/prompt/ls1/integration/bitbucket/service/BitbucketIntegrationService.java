package prompt.ls1.integration.bitbucket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.integration.bitbucket.BitbucketRestClient;
import prompt.ls1.integration.bitbucket.domain.BitbucketProject;
import prompt.ls1.integration.bitbucket.domain.BitbucketProjectPermissionGrant;
import prompt.ls1.integration.bitbucket.domain.BitbucketProjectRepositoryPermissionGrant;
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

    public List<BitbucketRepository> createRepositories(final String projectKey, final List<String> repositoryNames) {
        final List<BitbucketRepository> bitbucketRepositories = new ArrayList<>();
        repositoryNames.forEach(repositoryName -> {
            bitbucketRepositories.add(bitbucketRestClient.createRepository(projectKey, repositoryName));
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

    public List<BitbucketProject> getProjectsMatchingQuery(final String query) {
        return bitbucketRestClient.getProjects(query);
    }

    public List<BitbucketRepository> getRepositoriesForProject(final String projectKey) {
        return bitbucketRestClient.getRepositoriesForProject(projectKey);
    }

    public void grantProjectRepositoryPermissions(
            final List<BitbucketProjectRepositoryPermissionGrant> bitbucketProjectRepositoryPermissionGrants) {
        bitbucketProjectRepositoryPermissionGrants.forEach(bitbucketProjectRepositoryPermissionGrant -> {
            bitbucketProjectRepositoryPermissionGrant.getUsers().forEach(user -> {
                bitbucketRestClient.grantProjectRepositoryPermissionUser(
                        bitbucketProjectRepositoryPermissionGrant.getProjectKey(),
                        bitbucketProjectRepositoryPermissionGrant.getRepositorySlug(),
                        bitbucketProjectRepositoryPermissionGrant.getPermission(),
                        user);
            });

            bitbucketProjectRepositoryPermissionGrant.getGroupNames().forEach(groupName -> {
                bitbucketRestClient.grantProjectRepositoryPermissionGroup(
                        bitbucketProjectRepositoryPermissionGrant.getProjectKey(),
                        bitbucketProjectRepositoryPermissionGrant.getRepositorySlug(),
                        bitbucketProjectRepositoryPermissionGrant.getPermission(),
                        groupName
                );
            });
        });
    }
}
