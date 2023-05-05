package prompt.ls1.integration.bamboo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import kong.unirest.UnirestParsingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.UnirestRequestException;
import prompt.ls1.integration.bamboo.domain.BambooProject;

import java.io.IOException;

@Service
public class BambooRestClient {

    private final String bambooUrl;

    private final String username;

    private final String password;

    private final JsonNodeFactory jsonNodeFactory;

    private final ObjectMapper objectMapper;

    @Autowired
    public BambooRestClient(@Value("${prompt.atlassian.bamboo-url}") String bambooUrl,
                          @Value("${prompt.atlassian.username}") String username,
                          @Value("${prompt.atlassian.password}") String password) {
        this.bambooUrl = bambooUrl;
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

    public BambooProject createProject(final String projectName, final String projectKey) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("key", projectKey);
        payload.put("name", projectName);

        HttpResponse<BambooProject> response = Unirest.post(String.format("%s/rest/api/latest/project", bambooUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .body(payload)
                .asObject(BambooProject.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    public void grantProjectPermissions(final String projectKey, final String permission, final String groupName) {
        Unirest.put(String.format("%s/rest/api/latest/permissions/project/{projectKey}/groups/{groupName}", bambooUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("projectKey", projectKey)
                .routeParam("groupName", groupName)
                .body(new String[]{permission})
                .asObject(BambooProject.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });
    }
}
