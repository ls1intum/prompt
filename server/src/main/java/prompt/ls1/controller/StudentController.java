package prompt.ls1.controller;

import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.model.DevelopmentProfile;
import prompt.ls1.model.Student;
import prompt.ls1.service.StudentService;

import java.util.Optional;

@RestController
@RequestMapping("/students")
public class StudentController {
    private final StudentService studentService;

    @Autowired
    public StudentController(final StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/development-profile")
    public ResponseEntity<Optional<DevelopmentProfile>> getDevelopmentProfile(final JwtAuthenticationToken token) {
        final Student student = studentService.findByTumId(token.getName());
        return ResponseEntity.ok(studentService.getDevelopmentProfile(student.getId()));
    }

    @PostMapping("/development-profile")
    public ResponseEntity<DevelopmentProfile> saveDevelopmentProfile(
            @RequestBody @NotNull final DevelopmentProfile developmentProfile,
            final JwtAuthenticationToken token) {
        final Student student = studentService.findByTumId(token.getName());
        return ResponseEntity.ok(studentService.saveDevelopmentProfile(student.getId(), developmentProfile));
    }
}
