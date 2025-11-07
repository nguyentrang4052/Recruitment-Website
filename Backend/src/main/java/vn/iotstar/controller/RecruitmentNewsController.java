package vn.iotstar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import vn.iotstar.dto.RecruitmentNewsDTO;
import vn.iotstar.entity.RecruitmentNews;
import vn.iotstar.service.IRecruitmentNewsService;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/employer/recruitment")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RecruitmentNewsController {

    @Autowired
    private IRecruitmentNewsService recruitmentService;

   
    @GetMapping("/list")
    public List<RecruitmentNews> getAllRecruitmentNews() {
        try {
            return recruitmentService.findAll();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể tải danh sách tin tuyển dụng");
        }
    }


    @GetMapping("/{id}")
    public RecruitmentNews getRecruitmentById(@PathVariable Integer id) {
        return recruitmentService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tin tuyển dụng"));
    }

    @PostMapping("/create")
    public ResponseMessage createRecruitment(@RequestBody RecruitmentNewsDTO dto) {
        try {
            recruitmentService.save(dto);
            return new ResponseMessage("Thêm tin tuyển dụng thành công!");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể thêm tin tuyển dụng");
        }
    }

 
    @PutMapping("/update/{id}")
    public ResponseMessage updateRecruitment(@PathVariable Integer id, @RequestBody RecruitmentNewsDTO dto) {
        try {
            recruitmentService.update(id, dto);
            return new ResponseMessage("Cập nhật tin tuyển dụng thành công!");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể cập nhật tin tuyển dụng");
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseMessage deleteRecruitment(@PathVariable Integer id) {
        try {
            recruitmentService.delete(id);
            return new ResponseMessage("Xóa tin tuyển dụng thành công!");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể xóa tin tuyển dụng");
        }
    }


    static class ResponseMessage {
        private String message;

        public ResponseMessage(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
