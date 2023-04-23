package prompt.ls1.controller;

import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.integration.client.domain.JiraProjectCategory;
import prompt.ls1.model.ApplicationSemester;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.service.ApplicationSemesterService;
import prompt.ls1.service.JiraToolingService;
import prompt.ls1.service.ProjectTeamService;

import java.util.List;

@RestController
@RequestMapping("/infrastructure")
public class InstrastructureToolingController {

    @Autowired
    private JiraToolingService jiraToolingService;

    @Autowired
    private ApplicationSemesterService applicationSemesterService;

    @Autowired
    private ProjectTeamService projectTeamService;

    @PostMapping("/jira/projects")
    public ResponseEntity setupJiraTools(@RequestParam(name = "applicationSemester") @NotNull final String applicationSemesterName,
                                         @RequestBody final String projectLeadUsername) {
        final ApplicationSemester applicationSemester = applicationSemesterService.findBySemesterName(applicationSemesterName);
        final List<ProjectTeam> projectTeams = projectTeamService.findAllByApplicationSemesterId(applicationSemester.getId());

        jiraToolingService.createProjects(projectTeams, projectLeadUsername);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/jira/project-categories")
    public ResponseEntity<JiraProjectCategory> createJiraProjectCategory(@RequestBody final JiraProjectCategory jiraProjectCategory) {
        return ResponseEntity.ok(jiraToolingService.createProjectCategory(jiraProjectCategory));
    }
}
