package prompt.ls1.controller;

import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.integration.bamboo.domain.BambooProject;
import prompt.ls1.integration.bamboo.service.BambooIntegrationService;
import prompt.ls1.integration.bitbucket.domain.BitbucketProject;
import prompt.ls1.integration.bitbucket.domain.BitbucketProjectPermissionGrant;
import prompt.ls1.integration.bitbucket.domain.BitbucketProjectRepositoryPermissionGrant;
import prompt.ls1.integration.bitbucket.domain.BitbucketRepository;
import prompt.ls1.integration.bitbucket.service.BitbucketIntegrationService;
import prompt.ls1.integration.confluence.domain.ConfluenceSpace;
import prompt.ls1.integration.confluence.service.ConfluenceIntegrationService;
import prompt.ls1.integration.jira.domain.JiraGroup;
import prompt.ls1.integration.jira.domain.JiraProject;
import prompt.ls1.integration.jira.domain.JiraProjectCategory;
import prompt.ls1.integration.jira.domain.JiraProjectRole;
import prompt.ls1.integration.jira.domain.JiraProjectRoleActor;
import prompt.ls1.integration.jira.service.JiraIntegrationService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/infrastructure")
@PreAuthorize("hasRole('ipraktikum-pm')")
public class InfrastructureController {
    private final JiraIntegrationService jiraIntegrationService;
    private final BitbucketIntegrationService bitbucketIntegrationService;
    private final BambooIntegrationService bambooIntegrationService;
    private final ConfluenceIntegrationService confluenceIntegrationService;

    @Autowired
    public InfrastructureController(JiraIntegrationService jiraIntegrationService,
                                     BitbucketIntegrationService bitbucketIntegrationService,
                                     BambooIntegrationService bambooIntegrationService,
                                     ConfluenceIntegrationService confluenceIntegrationService) {
        this.jiraIntegrationService = jiraIntegrationService;
        this.bitbucketIntegrationService = bitbucketIntegrationService;
        this.bambooIntegrationService = bambooIntegrationService;
        this.confluenceIntegrationService = confluenceIntegrationService;
    }

    @PostMapping("/jira/groups")
    public ResponseEntity<List<JiraGroup>> createJiraGroups(@RequestBody final List<String> jiraGroupNames) {
        return ResponseEntity.ok(jiraIntegrationService.createGroups(jiraGroupNames));
    }

    @GetMapping("/jira/groups")
    public ResponseEntity<List<JiraGroup>> createJiraGroups(@RequestParam final String query) {
        return ResponseEntity.ok(jiraIntegrationService.getGroupsMatchingQuery(query));
    }

    @PostMapping("/jira/project-categories")
    public ResponseEntity<List<JiraProjectCategory>> createJiraProjectCategories(
            @RequestBody final List<String> jiraProjectCategoryNames) {
        return ResponseEntity.ok(jiraIntegrationService.createProjectCategories(jiraProjectCategoryNames));
    }

    @GetMapping("/jira/project-categories")
    public ResponseEntity<List<JiraProjectCategory>> getJiraProjectCategories() {
        return ResponseEntity.ok(jiraIntegrationService.getProjectCategories());
    }

    @PostMapping("/jira/projects")
    public ResponseEntity<List<JiraProject>> createJiraProjects(@RequestBody final List<JiraProject> jiraProjects) {
        return ResponseEntity.ok(jiraIntegrationService.createProjects(jiraProjects));
    }

    @GetMapping("/jira/projects")
    public ResponseEntity<List<JiraProject>> getJiraProjects(@RequestParam final String query) {
        return ResponseEntity.ok(jiraIntegrationService.getProjectsMatchingQuery(query));
    }

    @GetMapping("/jira/roles")
    public ResponseEntity<List<JiraProjectRole>> getAllJiraProjectRoles() {
        return ResponseEntity.ok(jiraIntegrationService.getAllProjectRoles());
    }

    @PostMapping("/jira/groups/{groupName}/users")
    public ResponseEntity<String> addUsersToJiraGroup(@PathVariable final String groupName,
                                              @RequestBody final List<String> usernames) {
        jiraIntegrationService.addUsersToGroup(groupName, usernames);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/jira/projects/roles/actors")
    public ResponseEntity<String> addProjectRoleActors(@RequestBody final List<JiraProjectRoleActor> jiraProjectRoleActors) {
        jiraIntegrationService.addActorsToProjectRole(jiraProjectRoleActors);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bitbucket/projects")
    public ResponseEntity<List<BitbucketProject>> createBitbucketProjects(@RequestParam final Boolean withRepository,
            @RequestBody final List<String> projectKeys) {
        final List<BitbucketProject> bitbucketProjects = bitbucketIntegrationService.createProjects(projectKeys);

        if (withRepository) {
            bitbucketIntegrationService.createRepositories(projectKeys);
        }

        return ResponseEntity.ok(bitbucketProjects);
    }

    @PostMapping("/bitbucket/projects/{projectKey}/repositories")
    public ResponseEntity<List<BitbucketRepository>> createBitbucketRepositories(
            @PathVariable final String projectKey,
            @RequestBody final List<String> repositoryNames) {
        return ResponseEntity.ok(bitbucketIntegrationService.createRepositories(projectKey, repositoryNames));
    }

    @PostMapping("/bitbucket/projects/permissions")
    public ResponseEntity<String> grantBitbucketProjectPermissions(
            @RequestBody final List<BitbucketProjectPermissionGrant> bitbucketProjectPermissionGrants) {
        bitbucketIntegrationService.grantProjectPermissions(bitbucketProjectPermissionGrants);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bitbucket/projects/repositories/permissions")
    public ResponseEntity<String> grantBitbucketProjectRepositoryPermissions(
            @RequestBody final List<BitbucketProjectRepositoryPermissionGrant> bitbucketProjectRepositoryPermissionGrants) {
        bitbucketIntegrationService.grantProjectRepositoryPermissions(bitbucketProjectRepositoryPermissionGrants);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/bitbucket/projects")
    public ResponseEntity<List<BitbucketProject>> getProjects(@RequestParam final String query) {
        return ResponseEntity.ok(bitbucketIntegrationService.getProjectsMatchingQuery(query));
    }

    @GetMapping("/bitbucket/projects/{projectKey}/repositories")
    public ResponseEntity<List<BitbucketRepository>> getRepositoriesForProject(@PathVariable final String projectKey) {
        return ResponseEntity.ok(bitbucketIntegrationService.getRepositoriesForProject(projectKey));
    }

    @PostMapping("/bitbucket/projects/{projectKey}/repositories/{repositorySlug}/setup")
    public ResponseEntity<String> setupBitbucketRepository(@PathVariable final String projectKey, @PathVariable final String repositorySlug) throws GitAPIException, IOException {
        bitbucketIntegrationService.setupRepository(projectKey, repositorySlug);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bamboo/projects")
    public ResponseEntity<List<BambooProject>> createBambooProjects(@RequestBody final List<BambooProject> bambooProjects) {
        return ResponseEntity.ok(bambooIntegrationService.createProjects(bambooProjects));
    }

    @PostMapping("/confluence/spaces")
    public ResponseEntity<List<ConfluenceSpace>> createConfluenceSpaces(@RequestBody final List<String> confluenceSpaceNames) {
        return ResponseEntity.ok(confluenceIntegrationService.createSpaces(confluenceSpaceNames));
    }
}
