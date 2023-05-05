package prompt.ls1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import prompt.ls1.model.Role;
import prompt.ls1.model.RoleType;
import prompt.ls1.repository.RoleRepository;

@SpringBootApplication
public class PromptApplication implements ApplicationRunner {

	@Autowired
    RoleRepository roleRepository;

	private static Logger logger = LoggerFactory.getLogger(PromptApplication.class);

	public static void main(String[] args) {SpringApplication.run(PromptApplication.class, args);}

	@Override
	public void run(ApplicationArguments applicationArguments) {

		final Role roleCoach = new Role(RoleType.COACH);
		final Role roleInstructor = new Role(RoleType.INSTRUCTOR);
		final Role rolePl = new Role(RoleType.PL);

		if (!roleRepository.existsByName(RoleType.COACH)) {
			roleRepository.save(roleCoach);
		}
		if (!roleRepository.existsByName(RoleType.INSTRUCTOR)) {
			roleRepository.save(roleInstructor);
		}
		if (!roleRepository.existsByName(RoleType.PL)) {
			roleRepository.save(rolePl);
		}

	}

}
