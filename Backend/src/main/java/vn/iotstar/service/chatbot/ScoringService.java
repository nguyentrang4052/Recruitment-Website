//package vn.iotstar.service.chatbot;
//
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//
//import lombok.RequiredArgsConstructor;
//import vn.iotstar.entity.Answer;
//import vn.iotstar.entity.JobPosition;
//import vn.iotstar.repository.interview.IAnswerRepository;
//
//@Service
//	@RequiredArgsConstructor
//	public class ScoringService {
//	    private  OpenAiChatClient chatClient;
//	    
//	    @Autowired
//	    private final IAnswerRepository repo;
//	    
//	    private final SimpMessagingTemplate ws;
//
//	    @Async
//	    public void score(Answer a) {
//	        JobPosition p = jobRepo.findById(posId).orElseThrow();
//	        String q = p.getQuestions().get(a.getQuestionIndex());
//
//	        String prompt = """
//	                Bạn là kỹ sư phỏng vấn Java.
//	                Câu hỏi: %s
//	                Câu trả lời: %s
//	                Hãy cho điểm 0-100 và góp ý 2 câu ngắn gọn.
//	                Trả lời JSON: {"score":85,"feedback":"..."}
//	                """.formatted(q, a.getTranscript());
//
//	        String resp = chatClient.call(prompt);
//	        try {
//	            JsonNode node = new ObjectMapper().readTree(resp);
//	            a.setScore(node.get("score").asInt());
//	            a.setFeedback(node.get("feedback").asText());
//	        } catch (Exception e) {
//	            a.setScore(0);
//	            a.setFeedback("Lỗi phân tích");
//	        }
//	        repo.save(a);
//
//	        // real-time về client
//	        ws.convertAndSend("/topic/answer/" + a.getSessionId(),
//	                Map.of("score", a.getScore(), "feedback", a.getFeedback()));
//	    }
//	}
//}
