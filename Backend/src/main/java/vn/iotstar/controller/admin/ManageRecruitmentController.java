package vn.iotstar.controller.admin;

import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import vn.iotstar.dto.applicant.RecruitmentCardDTO;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.entity.ViewLog;
import vn.iotstar.enums.EStatus;
import vn.iotstar.service.IRecruitmentService;

@RestController
@RequestMapping("/api/admin")
public class ManageRecruitmentController {

	@Autowired
	private IRecruitmentService rService;

	@GetMapping("/recruitment")
	public List<RecruitmentCardDTO> getAllRecruitments() {
		return rService.findAll().stream().map(rService::mapToDetail).toList();
	}

	@GetMapping("/recruitment/approve")
	public List<RecruitmentCardDTO> getRecruitmentApprove() {
		return rService.findAll().stream().filter(rn -> rn.getStatus() == EStatus.APPROVED)
				.sorted(Comparator.comparing(RecruitmentNews::getPostedAt)).map(rService::mapToDetail).toList();
	}

	@GetMapping("/recruitment/pending")
	public List<RecruitmentCardDTO> getRecruitmentPending() {
		return rService.findAll().stream().filter(rn -> rn.getStatus() == EStatus.PENDING)
				.sorted(Comparator.comparing(RecruitmentNews::getPostedAt)).map(rService::mapToDetail).toList();
	}

	@GetMapping("/recruitment/rejected")
	public List<RecruitmentCardDTO> getRecruitmentRejected() {
		return rService.findAll().stream().filter(rn -> rn.getStatus() == EStatus.REJECTED)
				.sorted(Comparator.comparing(RecruitmentNews::getPostedAt)).map(rService::mapToDetail).toList();
	}

	@GetMapping("/recruitment/detail")
	public RecruitmentCardDTO getRecruitmentDetail(@RequestParam Integer id) {
		RecruitmentNews reNews = rService.findById(id).get();
		return rService.mapToDetail(reNews);
	}

	@PostMapping("/recruitment/approve/{id}")
	public ResponseEntity<?> approveJob(@PathVariable Integer id) {
		boolean result = rService.updateStatus(id, EStatus.APPROVED);

		if (!result) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tin tuyển dụng!");
		}

		return ResponseEntity.ok("Phê duyệt thành công!");
	}

	@PostMapping("/recruitment/reject/{id}")
	public ResponseEntity<?> rejectJob(@PathVariable Integer id) {
		boolean result = rService.updateStatus(id, EStatus.REJECTED);

		if (!result) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tin tuyển dụng!");
		}

		return ResponseEntity.ok("Đã từ chối tin tuyển dụng!");
	}
}
