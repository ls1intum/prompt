package prompt.ls1.integration.tease.mapper;

import org.springframework.stereotype.Component;
import prompt.ls1.integration.tease.model.Project;
import prompt.ls1.model.ProjectTeam;

@Component
public class TeaseProjectMapper {

    public Project toTeaseProject(final ProjectTeam projectTeam) {
        final Project project = new Project();
        project.setId(projectTeam.getName());
        project.setName(projectTeam.getCustomer());
        return project;
    }
}
