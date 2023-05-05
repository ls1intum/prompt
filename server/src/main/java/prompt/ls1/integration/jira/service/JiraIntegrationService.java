package prompt.ls1.integration.jira.service;

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
