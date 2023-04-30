package prompt.ls1.integration.jira.service;

import kong.unirest.UnirestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.integration.jira.JiraRestClient;
import prompt.ls1.integration.jira.domain.JiraGroup;
import prompt.ls1.integration.jira.domain.JiraProject;
import prompt.ls1.integration.jira.domain.JiraProjectCategory;
import prompt.ls1.integration.jira.domain.JiraProjectRole;
import prompt.ls1.integration.jira.domain.JiraProjectRoleActor;

import java.util.ArrayList;
import java.util.List;

@Service
public class JiraIntegrationService {

    @Autowired
    private JiraRestClient jiraRestClient;

    private static String USERS_PROJECT_ROLE_NAME = "users";
    private static String ADMINISTRATORS_PROJECT_ROLE_NAME = "administrators";
    private static String DEVELOPERS_PROJECT_ROLE_NAME = "developers";

    /**
     * Setup permissions for a project
     * @param projectTeam - Project team with a valid project key
     * @param iosTag - IOS tag used for group names
     * @throws UnirestException
     */
   /* public void setPermissions(final ProjectTeam projectTeam, final String iosTag) throws UnirestException {
        final List<JiraProjectRole> jiraProjectRoles = jiraRestClient.getAllProjectRoles();

        final Optional<JiraProjectRole> usersRole = jiraProjectRoles.stream()
                .filter(role -> role.getName().equals(USERS_PROJECT_ROLE_NAME)).findFirst();
        final Optional<JiraProjectRole> developersRole = jiraProjectRoles.stream()
                .filter(role -> role.getName().equals(DEVELOPERS_PROJECT_ROLE_NAME)).findFirst();
        final Optional<JiraProjectRole> administratorsRole = jiraProjectRoles.stream()
                .filter(role -> role.getName().equals(ADMINISTRATORS_PROJECT_ROLE_NAME)).findFirst();

        if (usersRole.isEmpty()) {
            throw new JiraResourceNotFoundException("Role users not found.");
        }
        if (developersRole.isEmpty()) {
            throw new JiraResourceNotFoundException("Role developers not found.");
        }
        if (administratorsRole.isEmpty()) {
            throw new JiraResourceNotFoundException("Role administrators not found");
        }

        // Developers
        jiraRestClient.addProjectRoleActors(projectTeam.getProjectKey(),
                developersRole.get().getId().toString(),
                iosTag.toLowerCase());
        jiraRestClient.addProjectRoleActors(projectTeam.getProjectKey(),
                usersRole.get().getId().toString(),
                iosTag.toLowerCase());

        // Program Management
        jiraRestClient.addProjectRoleActors(projectTeam.getProjectKey(),
                administratorsRole.get().getId().toString(),
                String.format("%spm", iosTag.toLowerCase()));
        jiraRestClient.addProjectRoleActors(projectTeam.getProjectKey(),
                developersRole.get().getId().toString(),
                String.format("%spm", iosTag.toLowerCase()));
        jiraRestClient.addProjectRoleActors(projectTeam.getProjectKey(),
                usersRole.get().getId().toString(),
                String.format("%spm", iosTag.toLowerCase()));

        // Project Leads
        jiraRestClient.addProjectRoleActors(projectTeam.getProjectKey(),
                administratorsRole.get().getId().toString(),
                String.format("%s-mgmt", iosTag.toLowerCase()));
        jiraRestClient.addProjectRoleActors(projectTeam.getProjectKey(),
                developersRole.get().getId().toString(),
                String.format("%s-mgmt", iosTag.toLowerCase()));
        jiraRestClient.addProjectRoleActors(projectTeam.getProjectKey(),
                usersRole.get().getId().toString(),
                String.format("%s-mgmt", iosTag.toLowerCase()));

        // Customers
        jiraRestClient.addProjectRoleActors(projectTeam.getProjectKey(),
                developersRole.get().getId().toString(),
                String.format("%s-customers", iosTag.toLowerCase()));
        jiraRestClient.addProjectRoleActors(projectTeam.getProjectKey(),
                usersRole.get().getId().toString(),
                String.format("%s-customers", iosTag.toLowerCase()));
    }*/

    public List<JiraProject> createProjects(final List<JiraProject> jiraProjects) {
        final List<JiraProject> createdJiraProjects = new ArrayList<>();
        jiraProjects.forEach(jiraProject -> {
            createdJiraProjects.add(jiraRestClient.createProject(jiraProject));
        });

        return createdJiraProjects;
    }

    public List<JiraProjectCategory> createProjectCategories(final List<String> jiraProjectCategoryNames) {
        final List<JiraProjectCategory> jiraProjectCategories = new ArrayList<>();
        jiraProjectCategoryNames.forEach(jiraProjectCategoryName -> {
            jiraProjectCategories.add(jiraRestClient.createProjectCategory(jiraProjectCategoryName));
        });

        return jiraProjectCategories;
    }

    public List<JiraGroup> createGroups(final List<String> jiraGroupNames) {
        final List<JiraGroup> jiraGroups = new ArrayList<>();
        jiraGroupNames.forEach(jiraGroupName -> {
            jiraGroups.add(jiraRestClient.createGroup(jiraGroupName));
        });

        return jiraGroups;
    }

    public List<JiraProjectRole> getAllProjectRoles() {
        return jiraRestClient.getAllProjectRoles();
    }

    public List<JiraProjectCategory> getProjectCategories() {
        return jiraRestClient.getAllProjectCategories();
    }

    public void addUsersToGroup(final String groupName, final List<String> usernames) {
        usernames.forEach(username -> {
            jiraRestClient.addUserToGroup(username, groupName);
        });
    }

    public List<JiraGroup> getGroupsMatchingQuery(final String query) {
        return jiraRestClient.getGroups(query);
    }

    public List<JiraProject> getProjectsMatchingQuery(final String query) {
        return jiraRestClient.getProjects(query);
    }

    public void addActorsToProjectRole(final List<JiraProjectRoleActor> jiraProjectRoleActors) {
        jiraProjectRoleActors.forEach(jiraProjectRoleActor -> {
            jiraRestClient.addProjectRoleActors(jiraProjectRoleActor.getProjectKey(),
                    jiraProjectRoleActor.getRoleId(),
                    jiraProjectRoleActor.getGroupNames());
        });
    }

}
