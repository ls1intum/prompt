package prompt.ls1.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.model.Student;
import prompt.ls1.service.StudentService;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/students")
public class StudentController {

    final StudentService studentService;

    public StudentController(final StudentService studentService) {
        this.studentService = studentService;
    }

    @PatchMapping(path = "/{studentId}", consumes = "application/json-path+json")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Student> updateStudent(@PathVariable UUID studentId, @RequestBody JsonPatch patchStudent)
            throws JsonPatchException, JsonProcessingException {
        return ResponseEntity.ok(studentService.update(studentId, patchStudent));
    }
}
