package vn.iotstar.repository.interview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.JobPosition;

@Repository
public interface IJobPositionRepository extends JpaRepository<JobPosition, Integer> {

}
