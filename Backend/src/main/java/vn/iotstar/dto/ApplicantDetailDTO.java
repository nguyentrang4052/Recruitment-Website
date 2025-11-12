package vn.iotstar.dto;

import com.fasterxml.jackson.annotation.JsonProperty; // Thêm import
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicantDetailDTO {
    @JsonProperty("applicantId") // Đảm bảo frontend nhận đúng tên
    private Integer applicantID;
    
    private String applicantName;
    private String jobTitle;
    private String location;
    private String experience;
    private String desireSalary;
    private String photo; 
    private String email;
    private String phone;
    private String summary;
    private String literacy;
    private LocalDate birthday;
    private Integer gender;
    private String address;
    private String level; 
    private List<String> skillNames; 
    
    // THÊM FIELD NÀY - Quan trọng!
    private ApplicationDTO application; // Đổi từ List sang single object
    private List<ApplicationDTO> applications;
}