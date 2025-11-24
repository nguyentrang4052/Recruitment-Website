package vn.iotstar.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.iotstar.dto.SkillDTO;
import vn.iotstar.entity.Skill;
import vn.iotstar.service.ISkillService;

@RestController
@RequestMapping("/api/admin")
public class ManageSkillController {

	@Autowired
	private ISkillService skillService;

	@GetMapping("/skill")
	public List<SkillDTO> getAllSkill() {
		return skillService.findAllSkills().stream().map(skillService::mapToDetail).toList();
	}

	@PostMapping("/skill/create")
	public ResponseEntity<?> createSkill(@RequestBody SkillDTO dto) {
		if (dto.getSkillName() == null || dto.getSkillName().isBlank()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tên kỹ năng không được để trống!");
		}
		Skill skill = skillService.findBySkillName(dto.getSkillName());
		if (skill != null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Kỹ năng này đã tồn tại!");
		} else {
			Skill newSkill = new Skill();
			newSkill.setSkillName(dto.getSkillName());
			if (dto.getDescription() != null)
				newSkill.setDescription(dto.getDescription());
			else
				newSkill.setDescription(null);
			skillService.save(newSkill);
			return ResponseEntity.status(HttpStatus.CREATED).body(newSkill);
		}
	}

	@GetMapping("/skill/search")
	public List<SkillDTO> searchSkill(@RequestParam String skillName) {
		return skillService.findBySkillNameContainingIgnoreCase(skillName).stream().map(skillService::mapToDetail).toList();
	}

	@DeleteMapping("/skill/delete/{id}")
	public ResponseEntity<?> deleteSkill(@PathVariable Integer id) {

		boolean exists = skillService.existsById(id);

		if (!exists) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy");
		}
		
		boolean isSkillInUse = skillService.isSkillInUse(id);
        if (isSkillInUse) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Kỹ năng này đã được yêu cầu trong một tin tuyển dụng!");
        }

		skillService.deleteById(id);

		return ResponseEntity.ok("Xoá kỹ năng thành công!");
	}
}
