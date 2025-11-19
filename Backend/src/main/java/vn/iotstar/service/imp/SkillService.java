package vn.iotstar.service.imp;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.iotstar.dto.SkillDTO;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.entity.Skill;
import vn.iotstar.repository.IRecruitmentRepository;
import vn.iotstar.repository.ISkillRepository;
import vn.iotstar.service.ISkillService;

@Service
public class SkillService implements ISkillService {

    @Autowired
    private ISkillRepository skillRepository;
    
    @Autowired
    private IRecruitmentRepository repository;

    @Override
    public List<Skill> findAllSkills() {
        return skillRepository.findAll();
    }

    @Override
    public List<Skill> findOrCreateSkills(List<String> skillNames) {
        if (skillNames == null || skillNames.isEmpty()) {
            return new ArrayList<>();
        }

        List<Skill> existingSkills = skillRepository.findBySkillNameIn(skillNames);
        List<Skill> skillsToCreate = new ArrayList<>();
        
        List<String> existingNames = existingSkills.stream()
            .map(Skill::getSkillName) 
            .collect(Collectors.toList());

        for (String name : skillNames) {
            if (!existingNames.contains(name)) {
                Skill newSkill = new Skill();
                newSkill.setSkillName(name); 
                skillsToCreate.add(newSkill);
            }
        }
        
        skillRepository.saveAll(skillsToCreate);

        existingSkills.addAll(skillsToCreate);
        return existingSkills;
    }
    
    @Override
	public SkillDTO mapToDetail(Skill skill) {
    	return new SkillDTO(skill.getSkillID(), skill.getSkillName(), skill.getDescription());
    }

	@Override
	public List<Skill> findBySkillNameContaining(String skillName) {
		return skillRepository.findBySkillNameContaining(skillName);
	}

	@Override
	public Skill findBySkillName(String skillName) {
		return skillRepository.findBySkillName(skillName);
	}

	@Override
	public <S extends Skill> S save(S entity) {
		return skillRepository.save(entity);
	}

	@Override
	public boolean existsById(Integer id) {
		return skillRepository.existsById(id);
	}

	@Override
	public void deleteById(Integer id) {
		skillRepository.deleteById(id);
	}
    
	@Override
	public boolean isSkillInUse(Integer skillId) {
        List<RecruitmentNews> newsList = repository.findBySkill_skillID(skillId);
        return !newsList.isEmpty();
    }
}