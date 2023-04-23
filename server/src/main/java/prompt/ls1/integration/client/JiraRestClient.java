package prompt.ls1.integration.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import kong.unirest.UnirestException;
import kong.unirest.UnirestParsingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.UnirestRequestException;
import prompt.ls1.integration.client.domain.JiraGroup;
import prompt.ls1.integration.client.domain.JiraProject;
import prompt.ls1.integration.client.domain.JiraProjectCategory;
import prompt.ls1.integration.client.domain.JiraProjectRole;
import prompt.ls1.integration.client.domain.JiraUser;
import prompt.ls1.model.ProjectTeam;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class JiraRestClient {
    private String jiraUrl;

    private String username;

    private String password;

    private JsonNodeFactory jsonNodeFactory;

    private ObjectMapper objectMapper;

    @Autowired
    public JiraRestClient(@Value("${prompt.atlassian.jira.url}") String jiraUrl,
                          @Value("${prompt.atlassian.jira.username}") String username,
                          @Value("${prompt.atlassian.jira.password}") String password) {
        this.jiraUrl = jiraUrl;
        this.username = username;
        this.password = password;
        this.jsonNodeFactory = JsonNodeFactory.instance;
        this.objectMapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .configure(DeserializationFeature.FAIL_ON_MISSING_CREATOR_PROPERTIES, false);
        Unirest.config().setObjectMapper(new kong.unirest.ObjectMapper() {
            public <T> T readValue(String value, Class<T> valueType) {
                try {
                    return objectMapper.readValue(value, valueType);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            public String writeValue(Object value) {
                try {
                    return objectMapper.writeValueAsString(value);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    /**
     * Get Jira user by username
     * @param username
     * @return
     * @throws UnirestException
     */
    public JiraUser getUser(final String username) {
        HttpResponse<JiraUser> response = Unirest.get("https://{jiraUrl}/rest/api/2/user")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .queryString("username", username)
                .asObject(JiraUser.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    /**
     * Get all project roles
     * @return List of Jira roles
     * @throws UnirestException
     */
    public List<JiraProjectRole> getAllProjectRoles() {
        HttpResponse<JiraProjectRole[]> response = Unirest.get("https://{jiraUrl}/rest/api/2/role")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .asObject(JiraProjectRole[].class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });;

        return Arrays.asList(response.getBody());
    }

    /**
     * Get all project categories
     * @return
     * @throws UnirestException
     */
    public List<JiraProjectCategory> getAllProjectCategories() {
        HttpResponse<JiraProjectCategory[]> response = Unirest.get("https://{jiraUrl}/rest/api/2/projectCategory")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .asObject(JiraProjectCategory[].class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });;

        return Arrays.asList(response.getBody());
    }

    /**
     * Create a project
     * NOTE: It is not possible to specify a customer project template
     * @param projectTeam - Project team with a valid project name and project key
     * @param leadAccountUsername - Account id of the project lead user
     * @return
     * @throws UnirestException
     */
    public JiraProject createProject(final ProjectTeam projectTeam, final String leadAccountUsername, final String iosTag) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        // Required parameters
        payload.put("name", String.format("%s%s", iosTag.toUpperCase(), projectTeam.getName().toUpperCase()));
        payload.put("key", String.format("%s%s", iosTag.toUpperCase(), projectTeam.getName().toUpperCase()));
        // Optional parameters
        payload.put("description", String.format("Project for the %s team", projectTeam.getName()));
        payload.put("projectTypeKey", "software");
        payload.put("lead", leadAccountUsername);

        HttpResponse<JiraProject> response = Unirest.post("https://{jiraUrl}/rest/api/2/project")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .body(payload)
                .asObject(JiraProject.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    /**
     * Create a new project category
     * @param jiraProjectCategory - JiraProjectCategory object with name and description
     * @return
     * @throws UnirestException
     */
    public JiraProjectCategory createProjectCategory(final JiraProjectCategory jiraProjectCategory) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("name", jiraProjectCategory.getName());
        payload.put("description", jiraProjectCategory.getDescription());

        HttpResponse<JiraProjectCategory> response = Unirest.post("https://{jiraUrl}/rest/api/2/projectCategory")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .body(payload)
                .asObject(JiraProjectCategory.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    /**
     * Create a user group
     * @param userGroupName
     * @return
     * @throws UnirestException
     */
    public JiraGroup createUserGroup(final String userGroupName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("name", userGroupName);

        HttpResponse<JiraGroup> response = Unirest.post("https://{jiraUrl}/rest/api/2/group")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .body(payload)
                .asObject(JiraGroup.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    /**
     * Assigns a user to the specified group.
     * @param userId
     * @param groupName
     * @return
     * @throws UnirestException
     */
    public JiraGroup addUserToGroup(final String userId, final String groupName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("accountId", userId);

        HttpResponse<JiraGroup> response = Unirest.post("https://{jiraUrl}/rest/api/2/group/user")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .queryString("groupName", groupName)
                .routeParam("jiraUrl", jiraUrl)
                .body(payload)
                .asObject(JiraGroup.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    /**
     * Update the category of a project with the corresponding category
     * @param projectKey
     * @param categoryId
     * @return
     * @throws UnirestException
     */
    public JiraProject setProjectCategory(final String projectKey, final String categoryId) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("categoryId", categoryId);

        HttpResponse<JiraProject> response = Unirest.put("https://{jiraUrl}/rest/api/2/project/{projectKey}")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .routeParam("projectKey", projectKey)
                .body(payload)
                .asObject(JiraProject.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    /**
     * Update the URL of a project
     * @param projectKey
     * @param projectUrl
     * @return
     * @throws UnirestException
     */
    public JiraProject setProjectUrl(final String projectKey, final String projectUrl) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("url", projectUrl);

        HttpResponse<JiraProject> response = Unirest.put("https://{jiraUrl}/rest/api/2/project/{projectKey}")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .routeParam("projectKey", projectKey)
                .body(payload)
                .asObject(JiraProject.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    /**
     * Add a new role for a given group
     * @param projectKey
     * @param roleId
     * @param groupName
     * @return
     * @throws UnirestException
     */
    public JiraProjectRole addProjectRoleActors(final String projectKey, final String roleId, final String groupName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("group", groupName);

        HttpResponse<JiraProjectRole> response = Unirest.put("https://{jiraUrl}/rest/api/2/project/{projectKey}/role/{roleId}")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .routeParam("projectKey", projectKey)
                .routeParam("roleId", roleId)
                .body(payload)
                .asObject(JiraProjectRole.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });;

        return response.getBody();
    }

}
