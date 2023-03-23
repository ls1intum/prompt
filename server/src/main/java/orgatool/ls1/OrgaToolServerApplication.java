package orgatool.ls1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import orgatool.ls1.model.Role;
import orgatool.ls1.model.RoleType;
import orgatool.ls1.repository.RoleRepository;

@SpringBootApplication
public class OrgaToolServerApplication implements ApplicationRunner {

	@Autowired
	RoleRepository roleRepository;

	public static void main(String[] args) {SpringApplication.run(OrgaToolServerApplication.class, args);}

	@Override
	public void run(ApplicationArguments applicationArguments) throws Exception {

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
