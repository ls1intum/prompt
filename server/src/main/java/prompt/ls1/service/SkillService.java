package prompt.ls1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.Skill;
import prompt.ls1.repository.SkillRepository;

import java.util.List;
import java.util.UUID;

@Service
public class SkillService {
    private final SkillRepository skillRepository;

    @Autowired
    public SkillService(final SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<Skill> getAll() {
        return skillRepository.findAll();
    }

    public Skill create(final Skill skill) {
        return skillRepository.save(skill);
    }

    public Skill toggle(final UUID skillId) {
        final Skill skill = findById(skillId);
        skill.setActive(!skill.getActive());

        return skillRepository.save(skill);
    }

    public UUID delete(final UUID skillId) {
        findById(skillId);

        skillRepository.deleteById(skillId);
        return skillId;
    }

    private Skill findById(final UUID skillId) {
        return skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Skill with id %s not found.", skillId)));
    }
}
