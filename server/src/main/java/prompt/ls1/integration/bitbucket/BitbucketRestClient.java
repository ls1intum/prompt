package prompt.ls1.integration.bitbucket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;
import kong.unirest.UnirestParsingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.UnirestRequestException;
import prompt.ls1.integration.bitbucket.domain.BitbucketProject;
import prompt.ls1.integration.bitbucket.domain.BitbucketRepository;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class BitbucketRestClient {

    private final String bitbucketUrl;

    private final String username;

    private final String password;

    private final JsonNodeFactory jsonNodeFactory;

    private final ObjectMapper objectMapper;

    @Autowired
    public BitbucketRestClient(@Value("${prompt.atlassian.bitbucket-url}") String bitbucketUrl,
                          @Value("${prompt.atlassian.username}") String username,
                          @Value("${prompt.atlassian.password}") String password) {
        this.bitbucketUrl = bitbucketUrl;
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

    public BitbucketProject createProject(final String projectKey) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("key", projectKey);

        HttpResponse<BitbucketProject> response = Unirest.post(String.format("%s/rest/api/latest/projects", bitbucketUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .body(payload)
                .asObject(BitbucketProject.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    public List<BitbucketProject> getProjects(final String query) {
        HttpResponse<JsonNode> response = Unirest.get(String.format("%s/rest/api/latest/projects", bitbucketUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .queryString("name", query)
                .asJson()
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        try {
            return Arrays.asList(objectMapper
                    .readValue(response.getBody().getObject().getJSONArray("values").toString(), BitbucketProject[].class));
        } catch (JsonProcessingException e) {
            throw new UnirestRequestException(e.getMessage());
        }
    }

    public List<BitbucketRepository> getRepositoriesForProject(final String projectKey) {
        HttpResponse<JsonNode> response = Unirest.get(String.format("%s/rest/api/latest/projects/{projectKey}/repos", bitbucketUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("projectKey", projectKey)
                .asJson()
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        try {
            return Arrays.asList(objectMapper
                    .readValue(response.getBody().getObject().getJSONArray("values").toString(), BitbucketRepository[].class));
        } catch (JsonProcessingException e) {
            throw new UnirestRequestException(e.getMessage());
        }
    }

    public BitbucketRepository createRepository(final String projectKey, final String repositoryName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("name", repositoryName);

        HttpResponse<BitbucketRepository> response = Unirest.post(String
                        .format("%s/rest/api/latest/projects/{projectKey}/repos", bitbucketUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("projectKey", projectKey)
                .body(payload)
                .asObject(BitbucketRepository.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    public void grantProjectPermission(final String projectKey, final String permission, final String groupName) {
        Unirest.put(String
                        .format("%s/rest/api/latest/projects/{projectKey}/permissions/groups", bitbucketUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("projectKey", projectKey)
                .queryString("permission", permission)
                .queryString("name", groupName)
                .asJson()
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });
    }

    public void grantProjectRepositoryPermissionUser(final String projectKey, final String repositorySlug,
                                                 final String permission, final String user) {
        Unirest.put(String
                        .format("%s/rest/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/users", bitbucketUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("projectKey", projectKey)
                .routeParam("repositorySlug", repositorySlug)
                .queryString("permission", permission)
                .queryString("name", user)
                .asJson()
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });
    }

    public void grantProjectRepositoryPermissionGroup(final String projectKey, final String repositorySlug,
                                                     final String permission, final String groupName) {
        Unirest.put(String
                        .format("%s/rest/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/groups", bitbucketUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("projectKey", projectKey)
                .routeParam("repositorySlug", repositorySlug)
                .queryString("permission", permission)
                .queryString("name", groupName)
                .asJson()
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });
    }
}
