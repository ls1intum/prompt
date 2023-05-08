package prompt.ls1.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceConflictException;
import prompt.ls1.exception.ResourceInvalidParametersException;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.ApplicationSemester;
import prompt.ls1.repository.ApplicationSemesterRepository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class ApplicationSemesterService {
    private ApplicationSemesterRepository applicationSemesterRepository;
    private SimpleDateFormat simpleDateFormat;

    @Autowired
    public ApplicationSemesterService(final ApplicationSemesterRepository applicationSemesterRepository) {
        this.applicationSemesterRepository = applicationSemesterRepository;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.GERMAN);
    }

    public ApplicationSemester create(final ApplicationSemester applicationSemester) {
        Optional<ApplicationSemester> conflictApplicationSemester = applicationSemesterRepository
                .findBySemesterName(applicationSemester.getSemesterName());
        if (conflictApplicationSemester.isPresent()) {
            throw new ResourceConflictException(String.format("Application semester with name %s already exists.", applicationSemester.getSemesterName()));
        }

        if (applicationSemester.getApplicationPeriodStart().after(applicationSemester.getApplicationPeriodEnd())) {
            throw new ResourceInvalidParametersException("Application period start date is after the end date.");
        }

        List<ApplicationSemester> applicationSemesterPeriodOverlap = applicationSemesterRepository
                .findWithDateRangeOverlap(applicationSemester.getApplicationPeriodStart(), applicationSemester.getApplicationPeriodEnd());
        if (!applicationSemesterPeriodOverlap.isEmpty()) {
            throw new ResourceInvalidParametersException(String.format("Application semester period overlaps with existing application semester with name %s",
                    applicationSemesterPeriodOverlap.get(0).getSemesterName()));
        }

        return applicationSemesterRepository.save(applicationSemester);
    }

    public ApplicationSemester update(final UUID applicationSemesterId, JsonPatch patchApplicationSemester)
            throws JsonPatchException, JsonProcessingException{
        Optional<ApplicationSemester> existingApplicationSemester = applicationSemesterRepository.findById(applicationSemesterId);
        if (existingApplicationSemester.isEmpty()) {
            throw new ResourceNotFoundException(String.format("Application semester with id %s not found.",
                    applicationSemesterId));
        }

        ApplicationSemester patchedApplicationSemester = applyPatchToApplicationSemester(patchApplicationSemester, existingApplicationSemester.get());
        return applicationSemesterRepository.save(patchedApplicationSemester);
    }

    public UUID deleteById(final UUID applicationSemesterId) {
        Optional<ApplicationSemester> applicationSemester = applicationSemesterRepository.findById(applicationSemesterId);
        if (applicationSemester.isEmpty()) {
            throw new ResourceNotFoundException(String.format("Application semester with id %s not found.",
                    applicationSemesterId));
        }

        applicationSemesterRepository.deleteById(applicationSemesterId);
        return applicationSemester.get().getId();
    }

    public ApplicationSemester findBySemesterName(final String applicationSemesterName) {
        Optional<ApplicationSemester> applicationSemester = applicationSemesterRepository.findBySemesterName(applicationSemesterName);
        if (applicationSemester.isEmpty()) {
            throw new ResourceNotFoundException(String.format("Application semester with name %s not found.", applicationSemesterName));
        }

        return applicationSemester.get();
    }

    public List<ApplicationSemester> findAll() {
        return applicationSemesterRepository.findAll();
    }

    public Optional<ApplicationSemester> findWithOpenApplicationPeriod() throws ParseException{
        return applicationSemesterRepository.findWithApplicationPeriodIncludes(new Date());
    }

    private ApplicationSemester applyPatchToApplicationSemester(
            JsonPatch patch, ApplicationSemester targetApplicationSemester) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(targetApplicationSemester, JsonNode.class));
        return objectMapper.treeToValue(patched, ApplicationSemester.class);
    }
}
