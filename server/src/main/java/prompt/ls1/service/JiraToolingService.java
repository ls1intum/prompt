package prompt.ls1.service;

import kong.unirest.UnirestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.integration.client.JiraRestClient;
import prompt.ls1.integration.client.domain.JiraGroup;
import prompt.ls1.integration.client.domain.JiraProjectCategory;
import prompt.ls1.integration.client.domain.JiraProjectRole;
import prompt.ls1.integration.client.exception.JiraResourceNotFoundException;
import prompt.ls1.model.ProjectTeam;

import java.util.List;
import java.util.Optional;

@Service
public class JiraToolingService {

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
    public void setPermissions(final ProjectTeam projectTeam, final String iosTag) throws UnirestException {
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
    }

    public void createProjects(final List<ProjectTeam> projectTeams, final String projectLeadUsername) {
        projectTeams.forEach(projectTeam -> {
            jiraRestClient.createProject(projectTeam, projectLeadUsername, projectTeam.getApplicationSemester().getIosTag());
        });
    }

    public JiraProjectCategory createProjectCategory(final JiraProjectCategory jiraProjectCategory) {
        return jiraRestClient.createProjectCategory(jiraProjectCategory);
    }

    public JiraGroup createGroup(final JiraGroup jiraGroup) {
        return jiraRestClient.createUserGroup(jiraGroup);
    }

    public JiraGroup addUserToGroup(final String username, final String groupName) {
        return jiraRestClient.addUserToGroup(username, groupName);
    }

}
