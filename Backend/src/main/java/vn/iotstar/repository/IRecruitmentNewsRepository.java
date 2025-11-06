package vn.iotstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.iotstar.entity.RecruitmentNews;

@Repository
public interface IRecruitmentNewsRepository extends JpaRepository<RecruitmentNews, Integer> {
}
