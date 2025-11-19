package vn.iotstar.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.iotstar.entity.Skill;

@Repository
public interface ISkillRepository extends JpaRepository<Skill, Integer> {
    List<Skill> findBySkillNameIn(List<String> skillNames);
    List<Skill> findAll();
    
    
//    @Query("SELECT s FROM Skill s WHERE s.skillName LIKE %:skillName%")
//    List<Skill> findBySkillNameContaining(@Param("skillName") String skillName);
    
    List<Skill> findBySkillNameContaining(String skillName);
    
    Skill findBySkillName(String skillName);
}