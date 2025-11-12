package vn.iotstar.repository.interview;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.InterviewSession;

@Repository
public interface IInterviewSessionRepository extends JpaRepository<InterviewSession, UUID>{

}
