package vn.iotstar.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.iotstar.entity.Skill;

@Repository
public interface ISkillRepository extends JpaRepository<Skill, Integer> {
    List<Skill> findBySkillNameIn(List<String> skillNames);
    List<Skill> findAll();
}