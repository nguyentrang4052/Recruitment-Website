package vn.iotstar.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import vn.iotstar.entity.Skill;
import vn.iotstar.service.ISkillService;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SkillController {

    @Autowired
    private ISkillService skillService;

    @GetMapping("/list")
    public List<Skill> getAllSkills() {
        try {
            return skillService.findAllSkills();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể tải danh sách kỹ năng");
        }
    }
}