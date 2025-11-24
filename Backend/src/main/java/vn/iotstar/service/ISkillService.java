package vn.iotstar.service;

import java.util.List;

import vn.iotstar.dto.SkillDTO;
import vn.iotstar.entity.Skill;

public interface ISkillService {
	
	List<Skill> findAllSkills();
	
    List<vn.iotstar.entity.Skill> findOrCreateSkills(List<String> skillNames);

	SkillDTO mapToDetail(Skill skill);


	Skill findBySkillName(String skillName);

	<S extends Skill> S save(S entity);

	void deleteById(Integer id);

	boolean existsById(Integer id);

	boolean isSkillInUse(Integer skillId);

	List<Skill> findBySkillNameContainingIgnoreCase(String skillName); 
}
