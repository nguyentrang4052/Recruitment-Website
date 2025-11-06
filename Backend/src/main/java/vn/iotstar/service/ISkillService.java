package vn.iotstar.service;

import java.util.List;
import vn.iotstar.entity.Skill;

public interface ISkillService {
	
	List<Skill> findAllSkills();
	
    List<vn.iotstar.entity.Skill> findOrCreateSkills(List<String> skillNames); 
}
