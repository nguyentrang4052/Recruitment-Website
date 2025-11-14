//package vn.iotstar.controller.chatbot;
//
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import io.jsonwebtoken.io.IOException;
//import lombok.RequiredArgsConstructor;
//import vn.iotstar.repository.interview.IAnswerRepository;
//import vn.iotstar.repository.interview.IInterviewSessionRepository;
//import vn.iotstar.repository.interview.IJobPositionRepository;
//
//@RestController
//@RequestMapping("/api")
//@RequiredArgsConstructor
//public class ChatBotController {
//	 private final IJobPositionRepository jobRepo;
//	    private final IInterviewSessionRepository sessionRepo;
//	    private final IAnswerRepository answerRepo;
//	    private final S3Service s3Service;
//	    private final ScoringService scoringService;
//
//	    @GetMapping("/positions/{id}/questions")
//	    public List<String> questions(@PathVariable Integer id) {
//	        return jobRepo.findById(id).orElseThrow().getQuestions();
//	    }
//
//	    @PostMapping("/sessions")
//	    public UUID start(@RequestParam Integer positionId,
//	                      @RequestParam String email) {
//	        InterviewSession s = InterviewSession.builder()
//	                .positionId(positionId)
//	                .userEmail(email)
//	                .build();
//	        return sessionRepo.save(s).getId();
//	    }
//
//	    @PostMapping(value = "/answers", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//	    public ResponseEntity<?> upload(@RequestParam("audio") MultipartFile audio,
//	                                    @RequestParam String transcript,
//	                                    @RequestParam Integer questionIndex,
//	                                    @RequestParam UUID sessionId) throws IOException {
//	        String url = s3Service.upload(audio); // hoặc lưu local
//	        Answer a = Answer.builder()
//	                .sessionId(sessionId)
//	                .questionIndex(questionIndex)
//	                .audioUrl(url)
//	                .transcript(transcript)
//	                .build();
//	        answerRepo.save(a);
//	        scoringService.score(a); // bất đồng bộ
//	        return ResponseEntity.ok().build();
//	    }
//
//	    @PostMapping("/sessions/{id}/finish")
//	    public Map<String, Object> finish(@PathVariable UUID id) {
//	        List<Answer> list = answerRepo.findBySessionIdOrderByQuestionIndex(id);
//	        double avg = list.stream().mapToInt(Answer::getScore).average().orElse(0);
//	        String summary = "Điểm trung bình: " + Math.round(avg) + "/100\n";
//	        summary += list.stream()
//	                .map(a -> "Câu " + (a.getQuestionIndex() + 1) + ": " + a.getFeedback())
//	                .collect(Collectors.joining("\n"));
//	        return Map.of("summary", summary);
//	    }
//	}
//
//}
