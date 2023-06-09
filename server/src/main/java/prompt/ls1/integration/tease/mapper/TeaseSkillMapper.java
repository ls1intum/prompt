package prompt.ls1.integration.tease.mapper;

import org.springframework.stereotype.Component;
import prompt.ls1.integration.tease.model.Skill;

@Component
public class TeaseSkillMapper {

    public Skill toTeaseSkill(final prompt.ls1.model.Skill skill) {
        final Skill teaseSkill = new Skill();
        teaseSkill.setId(skill.getId().toString());
        teaseSkill.setTitle(skill.getTitle());
        teaseSkill.setDescription(skill.getDescription());
        return teaseSkill;
    }
}
