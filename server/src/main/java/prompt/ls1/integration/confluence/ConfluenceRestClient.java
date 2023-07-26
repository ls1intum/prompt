package prompt.ls1.integration.confluence;

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
import prompt.ls1.integration.confluence.domain.ConfluenceSpace;

import java.io.IOException;

@Service
public class ConfluenceRestClient {

    private final String confluenceUrl;

    private final String username;

    private final String password;

    private final JsonNodeFactory jsonNodeFactory;

    private final ObjectMapper objectMapper;

    @Autowired
    public ConfluenceRestClient(@Value("${prompt.atlassian.confluence-url}") String confluenceUrl,
                               @Value("${prompt.atlassian.username}") String username,
                               @Value("${prompt.atlassian.password}") String password) {
        this.confluenceUrl = confluenceUrl;
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

    public ConfluenceSpace createSpace(final ConfluenceSpace confluenceSpace) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("key", confluenceSpace.getKey());
        payload.put("name", confluenceSpace.getName());

        HttpResponse<ConfluenceSpace> response = Unirest.post(String.format("%s/rest/api/space", confluenceUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .body(payload)
                .asObject(ConfluenceSpace.class)
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        return response.getBody();
    }

    public void assignSpacePermissionToUserGroup(final String spaceKey, final String userGroupName, final String permissionName) {
        ObjectNode payload = jsonNodeFactory.objectNode();

        ObjectNode subjectNode = jsonNodeFactory.objectNode();
        subjectNode.put("type", "group");
        subjectNode.put("identifier", userGroupName);
        payload.set("subject", subjectNode);

        ObjectNode operationNode = jsonNodeFactory.objectNode();
        operationNode.put("key", permissionName);
        operationNode.put("target", "space");
        payload.set("operation", operationNode);

        HttpResponse<JsonNode> response = Unirest.post(String.format("%s/rest/api/space/%s/permission", confluenceUrl, spaceKey))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .body(payload)
                .asJson()
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });
    }
    
}
