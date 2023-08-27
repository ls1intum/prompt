package prompt.ls1.controller;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import prompt.ls1.controller.payload.ThesisApplicationAssessment;
import prompt.ls1.model.ThesisApplication;
import prompt.ls1.service.ThesisApplicationService;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/thesis-applications")
public class ThesisApplicationController {
    private final Bucket bucket;
    private final ThesisApplicationService thesisApplicationService;

    @Autowired
    public ThesisApplicationController(final ThesisApplicationService thesisApplicationService) {
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        this.bucket = Bucket.builder()
                .addLimit(limit)
                .build();
        this.thesisApplicationService = thesisApplicationService;
    }

    @GetMapping
    @PreAuthorize("hasRole('chair-member')")
    public ResponseEntity<List<ThesisApplication>> getAllNotAssessed() {
        return ResponseEntity.ok(thesisApplicationService.getAllNotAssessed());
    }

    @GetMapping("/{thesisApplicationId}/examination-report")
    @PreAuthorize("hasRole('chair-member')")
    public ResponseEntity<Resource> getExaminationReport(@PathVariable final UUID thesisApplicationId) throws IOException {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=examination_report_%s.pdf", thesisApplicationId))
                .body(thesisApplicationService.getExaminationReport(thesisApplicationId));
    }

    @GetMapping("/{thesisApplicationId}/cv")
    @PreAuthorize("hasRole('chair-member')")
    public ResponseEntity<Resource> getCV(@PathVariable final UUID thesisApplicationId) throws IOException {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=cv_%s.pdf", thesisApplicationId))
                .body(thesisApplicationService.getCV(thesisApplicationId));
    }

    @GetMapping("/{thesisApplicationId}/bachelor-report")
    @PreAuthorize("hasRole('chair-member')")
    public ResponseEntity<Resource> getBachelorReport(@PathVariable final UUID thesisApplicationId) throws IOException {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=bachelor_report_%s.pdf", thesisApplicationId))
                .body(thesisApplicationService.getBachelorReport(thesisApplicationId));
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ThesisApplication> create(@RequestPart("thesisApplication") final ThesisApplication thesisApplication,
                                                    @RequestPart(value = "examinationReport") final MultipartFile examinationReport,
                                                    @RequestPart(value = "cv") final MultipartFile cv,
                                                    @RequestPart(value = "bachelorReport", required = false) final MultipartFile bachelorReport) {
        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(thesisApplicationService.create(thesisApplication, examinationReport, cv, bachelorReport));
        }

        log.error("Post request on /thesis-applications was rejected due to exceeded request velocity.");
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @PostMapping("/{thesisApplicationId}/assessment")
    @PreAuthorize("hasRole('chair-member')")
    public ResponseEntity<ThesisApplication> assess(@PathVariable final UUID thesisApplicationId,
                                           @RequestBody final ThesisApplicationAssessment assessment) {
        return ResponseEntity.ok(thesisApplicationService.assess(thesisApplicationId, assessment.getStatus(), assessment.getAssessmentComment()));
    }
}
