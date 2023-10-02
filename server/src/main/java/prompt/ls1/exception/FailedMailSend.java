package prompt.ls1.exception;

public class FailedMailSend extends RuntimeException{

    public FailedMailSend(String message) {
        super(message);
    }
}
