package prompt.ls1.integration.bamboo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.integration.bamboo.BambooRestClient;
import prompt.ls1.integration.bamboo.domain.BambooProject;

import java.util.ArrayList;
import java.util.List;

@Service
public class BambooIntegrationService {

    @Autowired
    private BambooRestClient bambooRestClient;

    public List<BambooProject> createProjects(final List<BambooProject> bambooProjects) {
        final List<BambooProject> createdBambooProjects = new ArrayList<>();
        bambooProjects.forEach(bambooProject -> {
            createdBambooProjects.add(bambooRestClient.createProject(bambooProject.getName(), bambooProject.getKey()));
        });

        return createdBambooProjects;
    }
}
