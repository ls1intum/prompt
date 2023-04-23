package prompt.ls1.integration.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.UnirestRequestException;
import prompt.ls1.integration.client.domain.JiraProjectCategory;
import prompt.ls1.integration.client.domain.JiraRole;
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
        this.objectMapper = new ObjectMapper();
        Unirest.setObjectMapper(new com.mashape.unirest.http.ObjectMapper() {
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
    public JiraUser getUser(final String username) throws UnirestException {
        return Unirest.get("https://{jiraUrl}/rest/api/2/user")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .queryString("username", username)
                .asObject(JiraUser.class)
                .getBody();
    }

    /**
     * Get all project roles
     * @return List of Jira roles
     * @throws UnirestException
     */
    public List<JiraRole> getAllProjectRoles() throws UnirestException {
        JiraRole[] jiraRoles = Unirest.get("https://{jiraUrl}/rest/api/2/role")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .asObject(JiraRole[].class)
                .getBody();

        return Arrays.asList(jiraRoles);
    }

    /**
     * Get all project categories
     * @return
     * @throws UnirestException
     */
    public List<JiraProjectCategory> getAllProjectCategories() throws UnirestException {
        JiraProjectCategory[] jiraProjectCategories = Unirest.get("https://{jiraUrl}/rest/api/2/projectCategory")
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .routeParam("jiraUrl", jiraUrl)
                .asObject(JiraProjectCategory[].class)
                .getBody();

        return Arrays.asList(jiraProjectCategories);
    }

    /**
     * Create a project
     * NOTE: It is not possible to specify a customer project template
     * @param projectTeam - Project team with a valid project name and project key
     * @param leadAccountUsername - Account id of the project lead user
     * @return
     * @throws UnirestException
     */
    public JsonNode createProject(final ProjectTeam projectTeam, final String leadAccountUsername, final String iosTag) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        // Required parameters
        payload.put("name", String.format("%s%s", iosTag.toUpperCase(), projectTeam.getName().toUpperCase()));
        payload.put("key", String.format("%s%s", iosTag.toUpperCase(), projectTeam.getName().toUpperCase()));
        // Optional parameters
        payload.put("description", String.format("Project for the %s team", projectTeam.getName()));
        payload.put("projectTypeKey", "software");
        payload.put("lead", leadAccountUsername);

        try {
            HttpResponse<JsonNode> response = Unirest.post("https://{jiraUrl}/rest/api/2/project")
                    .basicAuth(username, password)
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .routeParam("jiraUrl", jiraUrl)
                    .body(payload)
                    .asJson();

            if (response.getStatus() < 200 || response.getStatus() >= 300) {
                throw new UnirestRequestException(response.getBody().getObject().get("errors").toString());
            }

            return response.getBody();
        } catch (UnirestException e) {
            throw new UnirestRequestException(e.getMessage());
        }
    }

    /**
     * Create a new project category
     * @param categoryName
     * @return
     * @throws UnirestException
     */
    public JsonNode createCategory(final String categoryName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("name", categoryName);

        HttpResponse<JsonNode> response = null;
        try {
            response = Unirest.post("https://{jiraUrl}/rest/api/2/projectCategory")
                    .basicAuth(username, password)
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .routeParam("jiraUrl", jiraUrl)
                    .body(payload)
                    .asJson();

            if (response.getStatus() < 200 || response.getStatus() >= 300) {
                throw new UnirestRequestException(response.getBody().getObject().get("errors").toString());
            }

            return response.getBody();
        } catch (UnirestException e) {
            throw new UnirestRequestException(e.getMessage());
        }
    }

    /**
     * Create a user group
     * @param userGroupName
     * @return
     * @throws UnirestException
     */
    public JsonNode createUserGroup(final String userGroupName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("name", userGroupName);

        HttpResponse<JsonNode> response = null;
        try {
            response = Unirest.post("https://{jiraUrl}/rest/api/2/group")
                    .basicAuth(username, password)
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .routeParam("jiraUrl", jiraUrl)
                    .body(payload)
                    .asJson();

            if (response.getStatus() < 200 || response.getStatus() >= 300) {
                throw new UnirestRequestException(response.getBody().getObject().get("errors").toString());
            }

            return response.getBody();
        } catch (UnirestException e) {
            throw new UnirestRequestException(e.getMessage());
        }
    }

    /**
     * Assigns a user to the specified group.
     * @param userId
     * @param groupName
     * @return
     * @throws UnirestException
     */
    public JsonNode addUserToGroup(final String userId, final String groupName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("accountId", userId);

        HttpResponse<JsonNode> response = null;
        try {
            response = Unirest.post("https://{jiraUrl}/rest/api/2/group/user")
                    .basicAuth(username, password)
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .queryString("groupName", groupName)
                    .routeParam("jiraUrl", jiraUrl)
                    .body(payload)
                    .asJson();

            if (response.getStatus() < 200 || response.getStatus() >= 300) {
                throw new UnirestRequestException(response.getBody().getObject().get("errors").toString());
            }

            return response.getBody();
        } catch (UnirestException e) {
            throw new UnirestRequestException(e.getMessage());
        }
    }

    /**
     * Update the category of a project with the corresponding category
     * @param projectKey
     * @param categoryId
     * @return
     * @throws UnirestException
     */
    public JsonNode setProjectCategory(final String projectKey, final String categoryId) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("categoryId", categoryId);

        HttpResponse<JsonNode> response = null;
        try {
            response = Unirest.put("https://{jiraUrl}/rest/api/2/project/{projectKey}")
                    .basicAuth(username, password)
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .routeParam("jiraUrl", jiraUrl)
                    .routeParam("projectKey", projectKey)
                    .body(payload)
                    .asJson();

            if (response.getStatus() < 200 || response.getStatus() >= 300) {
                throw new UnirestRequestException(response.getBody().getObject().get("errors").toString());
            }

            return response.getBody();
        } catch (UnirestException e) {
            throw new UnirestRequestException(e.getMessage());
        }
    }

    /**
     * Update the URL of a project
     * @param projectKey
     * @param projectUrl
     * @return
     * @throws UnirestException
     */
    public JsonNode setProjectUrl(final String projectKey, final String projectUrl) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("url", projectUrl);

        HttpResponse<JsonNode> response = null;
        try {
            response = Unirest.put("https://{jiraUrl}/rest/api/2/project/{projectKey}")
                    .basicAuth(username, password)
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .routeParam("jiraUrl", jiraUrl)
                    .routeParam("projectKey", projectKey)
                    .body(payload)
                    .asJson();

            if (response.getStatus() < 200 || response.getStatus() >= 300) {
                throw new UnirestRequestException(response.getBody().getObject().get("errors").toString());
            }

            return response.getBody();
        } catch (UnirestException e) {
            throw new UnirestRequestException(e.getMessage());
        }
    }

    /**
     * Add a new role for a given group
     * @param projectKey
     * @param roleId
     * @param groupName
     * @return
     * @throws UnirestException
     */
    public JsonNode addProjectRoleActors(final String projectKey, final String roleId, final String groupName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("group", groupName);

        HttpResponse<JsonNode> response = null;
        try {
            response = Unirest.put("https://{jiraUrl}/rest/api/2/project/{projectKey}/role/{roleId}")
                    .basicAuth(username, password)
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .routeParam("jiraUrl", jiraUrl)
                    .routeParam("projectKey", projectKey)
                    .routeParam("roleId", roleId)
                    .body(payload)
                    .asJson();

            if (response.getStatus() < 200 || response.getStatus() >= 300) {
                throw new UnirestRequestException(response.getBody().getObject().get("errors").toString());
            }

            return response.getBody();
        } catch (UnirestException e) {
            throw new UnirestRequestException(e.getMessage());
        }
    }

}
