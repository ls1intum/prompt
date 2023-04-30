package prompt.ls1.integration.jira;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;
import kong.unirest.UnirestException;
import kong.unirest.UnirestParsingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.UnirestRequestException;
import prompt.ls1.integration.jira.domain.JiraGroup;
import prompt.ls1.integration.jira.domain.JiraProject;
import prompt.ls1.integration.jira.domain.JiraProjectCategory;
import prompt.ls1.integration.jira.domain.JiraProjectRole;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class JiraRestClient {
    private final String jiraUrl;

    private final String username;

    private final String password;

    private final JsonNodeFactory jsonNodeFactory;

    private final ObjectMapper objectMapper;

    @Autowired
    public JiraRestClient(@Value("${prompt.atlassian.jira-url}") String jiraUrl,
                          @Value("${prompt.atlassian.username}") String username,
                          @Value("${prompt.atlassian.password}") String password) {
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
     * Get all project roles
     * @return List of Jira roles
     * @throws UnirestException
     */
    public List<JiraProjectRole> getAllProjectRoles() {
        HttpResponse<JiraProjectRole[]> response = Unirest.get(String.format("%s/rest/api/2/role", jiraUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .asObject(JiraProjectRole[].class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return Arrays.asList(response.getBody());
    }

    /**
     * Get all project categories
     * @return
     * @throws UnirestException
     */
    public List<JiraProjectCategory> getAllProjectCategories() {
        HttpResponse<JiraProjectCategory[]> response = Unirest.get(String.format("%s/rest/api/2/projectCategory", jiraUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .asObject(JiraProjectCategory[].class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return Arrays.asList(response.getBody());
    }

    /**
     * Get all projects matching query
     * @param query
     * @return
     */
    public List<JiraProject> getProjects(final String query) {
        HttpResponse<JsonNode> response = Unirest.get(String.format("%s/rest/api/2/projects/picker", jiraUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .queryString("query", query)
                .asJson()
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        try {
            return Arrays.asList(objectMapper
                    .readValue(response.getBody().getObject().getJSONArray("projects").toString(), JiraProject[].class));
        } catch (JsonProcessingException e) {
            throw new UnirestRequestException(e.getMessage());
        }
    }

    /**
     * Create a project
     * NOTE: It is not possible to specify a customer project template
     * @param jiraProject
     * @return
     * @throws UnirestException
     */
    public JiraProject createProject(final JiraProject jiraProject) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        // Required parameters
        payload.put("name", jiraProject.getName().toUpperCase());
        payload.put("key", jiraProject.getKey().toUpperCase());
        // Optional parameters
        payload.put("description", jiraProject.getDescription());
        payload.put("projectTypeKey", "software");
        payload.put("lead", jiraProject.getLead());
        payload.put("categoryId", jiraProject.getCategoryId());

        HttpResponse<JiraProject> response = Unirest.post(String.format("%s/rest/api/2/project", jiraUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
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
     * @param jiraProjectCategoryName
     * @return
     * @throws UnirestException
     */
    public JiraProjectCategory createProjectCategory(final String jiraProjectCategoryName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("name", jiraProjectCategoryName);
        payload.put("description", jiraProjectCategoryName);

        HttpResponse<JiraProjectCategory> response = Unirest.post(String.format("%s/rest/api/2/projectCategory", jiraUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
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
     * @param groupName
     * @return
     * @throws UnirestException
     */
    public JiraGroup createGroup(final String groupName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("name", groupName);

        HttpResponse<JiraGroup> response = Unirest.post(String.format("%s/rest/api/2/group", jiraUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .body(payload)
                .asObject(JiraGroup.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    /**
     * Find all groups matching the query string
     * @param query
     * @return
     * @throws UnirestException
     */
    public List<JiraGroup> getGroups(final String query) {

        HttpResponse<JsonNode> response = Unirest.get(String.format("%s/rest/api/2/groups/picker", jiraUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .queryString("query", query)
                .asJson()
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        try {
            return Arrays.asList(objectMapper
                    .readValue(response.getBody().getObject().getJSONArray("groups").toString(), JiraGroup[].class));
        } catch (JsonProcessingException e) {
            throw new UnirestRequestException(e.getMessage());
        }
    }

    /**
     * Assigns a user to the specified group.
     * @param username
     * @param groupName
     * @return
     * @throws UnirestException
     */
    public JiraGroup addUserToGroup(final String username, final String groupName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("name", username);

        HttpResponse<JiraGroup> response = Unirest.post(String.format("%s/rest/api/2/group/user", jiraUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .queryString("groupname", groupName)
                .body(payload)
                .asObject(JiraGroup.class)
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
     * @param groupNames - List of group names
     * @return
     * @throws UnirestException
     */
    public JiraProjectRole addProjectRoleActors(final String projectKey, final String roleId, final List<String> groupNames) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        ArrayNode groups = payload.putArray("group");
        groupNames.forEach(groupName -> {
            groups.add(groupName);
        });

        HttpResponse<JiraProjectRole> response = Unirest.post(String.format("%s/rest/api/2/project/{projectKey}/role/{roleId}", jiraUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("projectKey", projectKey)
                .routeParam("roleId", roleId)
                .body(payload)
                .asObject(JiraProjectRole.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

}
