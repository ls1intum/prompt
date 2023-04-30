package prompt.ls1.integration.jira.exception;

public class JiraResourceNotFoundException extends RuntimeException {

    public JiraResourceNotFoundException(String message) {
        super(message);
    }
}
