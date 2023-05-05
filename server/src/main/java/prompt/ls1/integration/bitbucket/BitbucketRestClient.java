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
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.TransportException;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.exception.UnirestRequestException;
import prompt.ls1.integration.bitbucket.domain.BitbucketProject;
import prompt.ls1.integration.bitbucket.domain.BitbucketRepository;
import prompt.ls1.integration.bitbucket.domain.BitbucketRepositoryLink;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
        payload.put("defaultBranch", "main");

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

        payload = jsonNodeFactory.objectNode();

        payload.put("id", "refs/heads/main");

        Unirest.put(String
                        .format("%s/rest/api/latest/projects/{projectKey}/repos/%s/default-branch",
                                bitbucketUrl, response.getBody().getSlug()))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("projectKey", projectKey)
                .body(payload)
                .asJson()
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

    public void setupRepository(final String projectKey, final String repositorySlug) {
        // Fetch the repository
        HttpResponse<JsonNode> response = Unirest.get(String
                        .format("%s/rest/api/latest/projects/{projectKey}/repos/{repositorySlug}", bitbucketUrl))
                .basicAuth(username, password)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .routeParam("projectKey", projectKey)
                .routeParam("repositorySlug", repositorySlug)
                .asJson()
                .ifFailure(Error.class, error -> {
                    UnirestParsingException ex = error.getParsingError().get();
                    throw new UnirestRequestException(ex.getOriginalBody());
                });

        try {
            // Extract the href to the repository
            final List<BitbucketRepositoryLink> bitbucketRepositoryLinks = Arrays.asList(objectMapper
                    .readValue(response.getBody().getObject().getJSONObject("links")
                            .getJSONArray("clone").toString(), BitbucketRepositoryLink[].class));

            Optional<BitbucketRepositoryLink> repositoryLink = bitbucketRepositoryLinks.stream()
                    .filter(bitbucketRepositoryLink -> bitbucketRepositoryLink.getName().equals("http"))
                    .findFirst();

            if (repositoryLink.isEmpty()) {
                throw new ResourceNotFoundException(String.format("Could not find a Bitbucket repository with slug %s.", repositorySlug));
            }

            Git.cloneRepository()
                    .setURI(repositoryLink.get().getHref())
                    .setCredentialsProvider(new UsernamePasswordCredentialsProvider(username, password))
                    .setDirectory(new File(String.format("./tmp/%s/%s", projectKey, repositorySlug)))
                    .call();

            // Create .gitignore and README.md files
            Path sourceGitignorePath = Paths.get("./src/main/resources/repo-gitignore.example");
            Path sourceReadmePath = Paths.get("./src/main/resources/repo-README.example.md");

            Path destinationGitignorePath = Paths.get(String.format("./tmp/%s/%s/.gitignore", projectKey, repositorySlug));
            Path destinationReadmePath = Paths.get(String.format("./tmp/%s/%s/README.md", projectKey, repositorySlug));

            File gitignoreFile = new File(String.format("./tmp/%s/%s/.gitignore", projectKey, repositorySlug));
            gitignoreFile.createNewFile();
            Files.write(destinationGitignorePath, Files.readAllBytes(sourceGitignorePath));

            File readmeFile = new File(String.format("./tmp/%s/%s/README.md", projectKey, repositorySlug));
            readmeFile.createNewFile();
            Files.write(destinationReadmePath, Files.readAllBytes(sourceReadmePath));

            // Add files to Git
            Git git = Git.open(new File(String.format("./tmp/%s/%s", projectKey, repositorySlug)));

            git.add().addFilepattern(".gitignore").call();
            git.add().addFilepattern("README.md").call();

            // Commit changes
            git.commit().setMessage("Initial commit").call();

            // Push changes to remote repository
            git.push().setCredentialsProvider(new UsernamePasswordCredentialsProvider(username, password)).call();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        } catch (TransportException e) {
            File tmpDirectory = new File("./tmp");
            deleteDirectory(tmpDirectory);
            setupRepository(projectKey, repositorySlug);
        } catch (IOException | GitAPIException e) {
            throw new RuntimeException(e);
        } finally {
            // Clean up the tmp directory with cloned repositories
            File tmpDirectory = new File("./tmp");
            deleteDirectory(tmpDirectory);
        }
    }

    /**
     * Recursive function to deep delete a directory
     * @param directory
     */
    private void deleteDirectory(final File directory) {
        if (directory.exists()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        deleteDirectory(file);
                    } else {
                        file.delete();
                    }
                }
            }
            directory.delete();
        }
    }
}
