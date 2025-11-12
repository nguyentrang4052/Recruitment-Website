package vn.iotstar.repository.interview;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.Answer;

@Repository
public interface IAnswerRepository extends JpaRepository<Answer, Integer>{
	List<Answer> findBySessionIdOrderByQuestionIndex(UUID sessionId);

}
