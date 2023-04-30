package prompt.ls1.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.model.ApplicationSemester;
import prompt.ls1.service.ApplicationSemesterService;

import java.text.ParseException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/application-semesters")
public class ApplicationSemesterController {
    @Autowired
    private ApplicationSemesterService applicationSemesterService;

    @GetMapping
    public ResponseEntity<List<ApplicationSemester>> getAllApplicationSemesters(@RequestParam(required = false)
                                                                                    String applicationPeriodDate) throws ParseException{
        if (applicationPeriodDate != null) {
            return ResponseEntity.ok(applicationSemesterService.findAllWithApplicationPeriodIncludes(applicationPeriodDate));
        }
        return ResponseEntity.ok(applicationSemesterService.findAll());
    }

    @PostMapping
    public ResponseEntity<ApplicationSemester> createApplicationSemester(@RequestBody ApplicationSemester applicationSemester) {
        return ResponseEntity.ok(applicationSemesterService.create(applicationSemester));
    }

    @PatchMapping(path = "/{applicationSemesterId}", consumes = "application/json-path+json")
    public ResponseEntity<ApplicationSemester> updateApplicationSemester(@PathVariable UUID applicationSemesterId,
                                                                 @RequestBody JsonPatch patchApplicationSemester)
            throws JsonPatchException, JsonProcessingException{
        return ResponseEntity.ok(applicationSemesterService.update(applicationSemesterId, patchApplicationSemester));
    }

    @DeleteMapping("/{applicationSemesterId}")
    public ResponseEntity<UUID> deleteApplicationSemester(@PathVariable UUID applicationSemesterId) {
        return ResponseEntity.ok(applicationSemesterService.deleteById(applicationSemesterId));
    }
}