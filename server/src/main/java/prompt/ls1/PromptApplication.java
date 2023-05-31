package prompt.ls1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PromptApplication implements ApplicationRunner {

	private static Logger logger = LoggerFactory.getLogger(PromptApplication.class);

	public static void main(String[] args) {SpringApplication.run(PromptApplication.class, args);}

	@Override
	public void run(ApplicationArguments applicationArguments) { }

}
